package edu.jorge.proyectodaw.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.repositories.ProductRepo;
import jakarta.persistence.EntityNotFoundException;
import edu.jorge.proyectodaw.enums.CategoryType;

@Service
public class ProductServiceImp implements ProductService {

    @Autowired
    private ProductRepo productRepo;
    
    @Autowired
    private CategoryService categoryService;
    @Autowired
    private FeatureService featureService;

    @Override
    public List<Product> findAll() {
        return productRepo.findAll();
    }

    @Override
    public Product findById(Long id) {
        return productRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado con id: " + id));
    }

    @Override
    public Product save(Product product) {
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            product.setCategory(categoryService.findById(product.getCategory().getId()));
        }

        if (product.getProductFeatures() != null) {
            for (var feature : product.getProductFeatures()) {
                if (feature.getFeature() != null && feature.getFeature().getId() != null) {
                    feature.setFeature(featureService.findById(feature.getFeature().getId()));
                }
            }
            
        }

        switch (product.getCategory().getCategoryType()) {
            case CategoryType.SNOWBOARD:
                // TODO featureRepo.findById(1L)
                break;
            case CategoryType.SKI:
                
                break;
        
            default:
                break;
        }

        product.getProductFeatures();
        return productRepo.save(product);
    }

    @Override
    public Product update(Long id, Product product) {
        Product existingProduct = findById(id);
        existingProduct.setName(product.getName());
        existingProduct.setDescription(product.getDescription());
        existingProduct.setPrice(product.getPrice());
        existingProduct.setStock(product.getStock());
        existingProduct.setCategory(product.getCategory());
        return productRepo.save(existingProduct);
    }

    @Override
    public void delete(Long id) {
        Product product = findById(id);
        productRepo.delete(product);
    }
}