package edu.jorge.proyectodaw.controller;

import org.hibernate.service.spi.InjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.jorge.proyectodaw.controller.dto.input.ProductCreateInputDTO;
import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateInputDTO productDTO) {
        Category category = new Category();
        category.setId(productDTO.getIdCategory());

        Product product = new Product();
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setCategory(category);

        // for (ProductFeatureInputDTO productFeatures : productDTO.getProductFeatures()) {
        //     ProductFeature feature = new ProductFeature();
        //     feature.setProduct(
        //         new Product(
        //             productFeatures.getId()
        //         )
        //     );
        // }
        
        Product createdProduct = productService.save(product);
        
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }
}

