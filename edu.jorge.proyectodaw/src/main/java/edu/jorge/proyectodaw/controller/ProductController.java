package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.ProductCreateInputDTO;
import edu.jorge.proyectodaw.controller.dto.input.ProductFeatureInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.*;
import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.entity.ProductFeature;
import edu.jorge.proyectodaw.service.ProductService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/products")
/**
 * GET / ==> getAllProducts
 * GET /{id} ==> getProductById
 * POST / ==> createProduct
 * DELETE /{id} ==> deleteProduct
 */
public class ProductController {

    @Autowired
    private ProductService productService;

    @Value("${ecommerce.imgDir}")//:/images/products/
    private String photosDir;

    private Path storagePath;

    @PostConstruct
    public void init() {
        storagePath = Paths.get(photosDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(storagePath);
        } catch (IOException e) {
            throw new RuntimeException("No se pudo crear el directorio para guardar fotos: " + storagePath, e);
        }
    }

    @PostMapping
    public ResponseEntity<ProductFullOutputDTO> createProduct(@RequestBody ProductCreateInputDTO productDTO) {
        // Input DTO
        Category category = new Category();
        category.setId(productDTO.getIdCategory());

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(category);

        List<ProductFeature> productFeatures = new ArrayList<>();
         for (ProductFeatureInputDTO productFeaturesDto : productDTO.getProductFeatures()) {
             productFeatures.add(
                     new ProductFeature(
                             null
                             ,null
                             ,new Feature(productFeaturesDto.getIdFeature(),null)
                             ,productFeaturesDto.getValue()
                     )
             );
         }
        product.setProductFeatures(productFeatures);

        // Entity
        Product createdProduct = productService.save(product);

        // Output DTO
        ProductFullOutputDTO createdProductDTO = new ProductFullOutputDTO();
        createdProductDTO.setId(createdProduct.getId());
        createdProductDTO.setName(createdProduct.getName());
        createdProductDTO.setDescription(createdProduct.getDescription());
        createdProductDTO.setPrice(createdProduct.getPrice());
        createdProductDTO.setStock(createdProduct.getStock());
        createdProductDTO.setCategoryName(createdProduct.getCategory().getName());

        // Response
        return ResponseEntity.ok(createdProductDTO);
    }

    @PostMapping("/dto")
    public ResponseEntity<ProductSimpleOutputDTO> createProductDto(@RequestBody ProductCreateInputDTO productDTO) {
        Product createdProduct = productService.save(productDTO);

        // Output DTO
        ProductSimpleOutputDTO createdProductDTO = new ProductSimpleOutputDTO();
        createdProductDTO.setName(createdProduct.getName());
        createdProductDTO.setPrice(createdProduct.getPrice());
        createdProductDTO.setCategoryType(createdProduct.getCategory().getCategoryType().getDescription());

        // Reponse
        return ResponseEntity.ok(createdProductDTO);
    }

    @PatchMapping("/{id}/imgs")
    public ResponseEntity<?> uploadImgs(
            @PathVariable("id") Long productId,
            @RequestParam("files") MultipartFile[] files
    ) {
        if (files == null || files.length == 0) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No se han proporcionado archivos");
        }

        List<String> fileDownloadUris = new ArrayList<>();

        for (MultipartFile file : files) {
            if (file.isEmpty()) {
                continue;
            }

            String originalFilename = StringUtils.cleanPath(file.getOriginalFilename());
            String fileExtension = "";
            int dotIndex = originalFilename.lastIndexOf('.');
            if (dotIndex > 0 && dotIndex < originalFilename.length() - 1) {
                fileExtension = originalFilename.substring(dotIndex);
            }
            String filename = "product_" + productId + "_" + System.currentTimeMillis() + fileExtension;

            try {
                Path targetLocation = storagePath.resolve(filename);
                Files.copy(file.getInputStream(), targetLocation);
                String fileDownloadUri = "/" + photosDir + filename;
                fileDownloadUris.add(fileDownloadUri);
            } catch (IOException ex) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("No se pudo subir la foto: " + originalFilename + ". Error: " + ex.getMessage());
            }
        }

        if (fileDownloadUris.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ningún archivo válido para subir");
        }

        return ResponseEntity.ok("Fotos subidas correctamente: " + fileDownloadUris);
    }

    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestParam(defaultValue = "simple") String outputType) {
        List<Product> products = productService.findAll();

        return switch (outputType.toLowerCase()) {
            case "full" -> {
                List<ProductFullOutputDTO> fullOutput = new ArrayList<>();
                for (Product product : products) {
                    fullOutput.add(convertToFullDTO(product));
                }
                yield ResponseEntity.ok(fullOutput);
            }
            case "simple" -> {
                List<ProductSimpleOutputDTO> simpleOutput = new ArrayList<>();
                for (Product product : products) {
                    simpleOutput.add(convertToSimpleDTO(product));
                }
                yield ResponseEntity.ok(simpleOutput);
            }
            case "list" -> {
                List<ProductListOutputDTO> fullOutput = new ArrayList<>();
                for (Product product : products) {
                    fullOutput.add(convertToListDTO(product));
                }
                yield ResponseEntity.ok(fullOutput);
            }
            default -> ResponseEntity.badRequest().body("Invalid outputType. Use 'simple' or 'full'.");
        };
    }


    @GetMapping("/{id}")
    public ResponseEntity<ProductFullOutputDTO> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(
                convertToFullDTO(
                        productService.findById(id)
                )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        Product updatedProduct = productService.update(id, product);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        productService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductSimpleOutputDTO>> getProductsByCategoryId(@PathVariable Long categoryId) {
        List<Product> products = productService.findByCategoryId(categoryId);
        List<ProductSimpleOutputDTO> productSimpleOutputDTOS = new ArrayList<>();
        for (Product product : products) {
            productSimpleOutputDTOS.add(convertToSimpleDTO(product));
        }
        return ResponseEntity.ok(productSimpleOutputDTOS);
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductSimpleOutputDTO>> searchProductsByName(@RequestParam String name) {
        List<Product> products = productService.findByNameContaining(name);

        List<ProductSimpleOutputDTO> productSimpleOutputDTOS = new ArrayList<>();
        for (Product product : products) {
            productSimpleOutputDTOS.add(convertToSimpleDTO(product));
        }

        return ResponseEntity.ok(productSimpleOutputDTOS);
    }

    @GetMapping("/price-range")
    public ResponseEntity<List<ProductSimpleOutputDTO>> getProductsByPriceRange(
            @RequestParam Double minPrice,
            @RequestParam Double maxPrice) {
        List<Product> products = productService.findByPriceRange(minPrice, maxPrice);

        List<ProductSimpleOutputDTO> productSimpleOutputDTOS = new ArrayList<>();
        for (Product product : products) {
            productSimpleOutputDTOS.add(convertToSimpleDTO(product));
        }

        return ResponseEntity.ok(productSimpleOutputDTOS);
    }

    private ProductSimpleOutputDTO convertToSimpleDTO(Product product) {
        ProductSimpleOutputDTO dto = new ProductSimpleOutputDTO();
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        if (product.getCategory().getCategoryType() != null) {
            dto.setCategoryType(product.getCategory().getCategoryType().getDescription());
        } else {
            dto.setCategoryType("No Category Type");
        }
        return dto;
    }

    @GetMapping("/featured")
    private ProductFullOutputDTO convertToFullDTO(Product product) {
        ProductFullOutputDTO dto = new ProductFullOutputDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());

        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
        } else {
            dto.setCategoryName("No category");
        }

        if (product.getProductFeatures() != null && !product.getProductFeatures().isEmpty()) {
            dto.setFeatures(
                product.getProductFeatures().stream()
                    .map(feature -> new FeatureProductSimpleOutputDTO(
                        feature.getId(),
                        feature.getFeature().getName(),
                        feature.getValue().toString()
                    ))
                    .collect(Collectors.toList())
            );
        } else {
            dto.setFeatures(Collections.emptyList());
        }

        if (product.getReview() != null && !product.getReview().isEmpty()) {
            dto.setReviews(
                product.getReview().stream()
                    .map(review -> new ReviewSimpleOutputDTO(
                        review.getStars(),
                        review.getComment(),
                        review.getClient().getName()
                    ))
                    .collect(Collectors.toList())
            );
        } else {
            dto.setReviews(Collections.emptyList());
        }

        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setImages(product.getImages());
        } else {
            dto.setImages(Collections.emptyList());
        }

        return dto;
    }

    private ProductListOutputDTO convertToListDTO(Product product) {
        ProductListOutputDTO dto = new ProductListOutputDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setPrice(product.getPrice());
        if (product.getCategory() != null) {
            dto.setCategoryName(product.getCategory().getName());
        } else {
            dto.setCategoryName("No Category");
        }
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            dto.setImages(product.getImages());
        } else {
            dto.setImages(Collections.emptyList());
        }
        return dto;
    }
}

