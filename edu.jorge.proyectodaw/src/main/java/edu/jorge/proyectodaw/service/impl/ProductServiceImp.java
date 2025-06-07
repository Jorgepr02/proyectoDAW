package edu.jorge.proyectodaw.service.impl;

import edu.jorge.proyectodaw.controller.dto.input.ProductCreateInputDTO;
import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.entity.ProductFeature;
import edu.jorge.proyectodaw.enums.CategoryType;
import edu.jorge.proyectodaw.repositories.ProductFeatureRepo;
import edu.jorge.proyectodaw.repositories.ProductRepo;
import edu.jorge.proyectodaw.service.CategoryService;
import edu.jorge.proyectodaw.service.FeatureService;
import edu.jorge.proyectodaw.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImp implements ProductService {

    @Autowired
    private ProductRepo productRepo;
    @Autowired
    private ProductFeatureRepo productFeatureRepo;
    
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
        product.setCategory(categoryService.findById(product.getCategory().getId()));
        return productRepo.save(product);
    }

    @Override
    public Product create(Product product) {
        product.setCategory(categoryService.findById(product.getCategory().getId()));
        product.setStock(10);

        Product createdProduct = productRepo.save(product);

        if (product.getProductFeatures() != null) {
            for (ProductFeature productFeature : product.getProductFeatures()) {
                Feature feature = featureService.findById(productFeature.getFeature().getId());
                productFeature.setProduct(createdProduct);
                productFeature.setFeature(feature);
                productFeatureRepo.save(productFeature);
            }
        }

        if (product.getCategory().getCategoryType() == CategoryType.ACCESORY) {
            product.setProductFeatures(null);
        } else {
            if (product.getProductFeatures() == null || product.getProductFeatures().isEmpty()) {
                throw new IllegalArgumentException("Los productos de tipo " + product.getCategory().getCategoryType() + " deben tener al menos una característica.");
            }
        }

        return createdProduct;
    }

// TODO ESTO ES UN EJEMPLO ¡¡NO SE UTILIZA!!
//    @Override
//    public Product save(Product product) {
//        product.setStock(0);
//
//        if (product.getCategory() != null && product.getCategory().getId() != null) {
//            product.setCategory(categoryService.findById(product.getCategory().getId()));
//        }
//
//        if (product.getProductFeatures() != null) {
//            for (var feature : product.getProductFeatures()) {
//                if (feature.getFeature() != null && feature.getFeature().getId() != null) {
//                    feature.setFeature(featureService.findById(feature.getFeature().getId()));
//                }
//            }
//
//        }
//
//        if (product.getCategory().getCategoryType() == CategoryType.ACCESORY) {
//            product.setProductFeatures(null);
//        } else {
//            if (product.getProductFeatures() == null || product.getProductFeatures().isEmpty()) {
//                throw new IllegalArgumentException("Los productos de tipo " + product.getCategory().getCategoryType() + " deben tener al menos una característica.");
//            }
//
//            List<Feature> features = featureService.findAll();
//            List<ProductFeature> productFeatures = new ArrayList<>();
//            for (Feature feature : features) {
//                productFeatures.add(
//                        new ProductFeature(null, product, feature, null)
//                );
//            }
//            product.setProductFeatures(productFeatures);
//        }
//
//        return productRepo.save(product);
//    }

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

    // TODO ESTE SI SE ESTÁ UTILIZANDO
    @Override
    @Transactional
    public Product save(ProductCreateInputDTO productCreateInputDTO) {

        Product productToSave = new Product();
        productToSave.setName(productCreateInputDTO.getName());
        productToSave.setDescription(productCreateInputDTO.getDescription());
        productToSave.setPrice(productCreateInputDTO.getPrice());
        productToSave.setCategory(categoryService.findById(productCreateInputDTO.getIdCategory()));
        productToSave.setStock(0); // Inicializamos el stock a 0

        Product productCreated = productRepo.saveAndFlush(productToSave); // Se podría omitir, por Transación SQL

//        List<ProductFeature> productFeatures = new ArrayList<>();
        for (var featureInput : productCreateInputDTO.getProductFeatures()) {
            Feature feature = featureService.findById(featureInput.getIdFeature());
            ProductFeature productFeature = new ProductFeature(null, productCreated, feature, featureInput.getValue());

            productFeatureRepo.save(productFeature);
//            productFeatures.add(productFeature);
        }

//        productToSave.setProductFeatures(productFeatures);
//        Product productCreated = productRepo.saveAndFlush(productToSave);

        return productCreated;
    }

    @Override
    public List<Product> findByCategoryId(Long categoryId) {
        return productRepo.findByCategoryId(categoryId);
    }

    @Override
    public List<Product> findByNameContaining(String name) {
        return productRepo.findByNameContainingIgnoreCase(name);
    }

    @Override
    public List<Product> findByPriceRange(Double minPrice, Double maxPrice) {
        return productRepo.findByPriceBetween(minPrice, maxPrice);
    }
}