package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.ProductCreateInputDTO;
import edu.jorge.proyectodaw.controller.dto.input.ProductFeatureInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ProductFullOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ProductSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.entity.ProductFeature;
import edu.jorge.proyectodaw.service.ProductService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.repository.query.Param;
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
import java.util.List;

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

}

