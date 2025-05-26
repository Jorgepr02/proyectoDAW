package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.ProductCreateInputDTO;
import edu.jorge.proyectodaw.controller.dto.input.ProductFeatureInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ProductSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.entity.ProductFeature;
import edu.jorge.proyectodaw.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    @PostMapping
    public ResponseEntity<ProductSimpleOutputDTO> createProduct(@RequestBody ProductCreateInputDTO productDTO) {
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

        // Entidad
        Product createdProduct = productService.save(product);

        // Output DTO
        ProductSimpleOutputDTO createdProductDTO = new ProductSimpleOutputDTO();
        createdProductDTO.setName(createdProduct.getName());
        createdProductDTO.setPrice(createdProduct.getPrice());
        createdProductDTO.setCategoryType(createdProduct.getCategory().getCategoryType().getDescription());

        // Reponse
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
}

