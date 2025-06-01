package edu.jorge.proyectodaw.service;

import edu.jorge.proyectodaw.controller.dto.input.ProductCreateInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ProductSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.enums.CategoryType;

import java.util.List;

public interface ProductService {
    List<Product> findAll();
    Product findById(Long id);
    Product save(Product product);
    Product update(Long id, Product product);
    void delete(Long id);
    Product save(ProductCreateInputDTO product); // TODO para cambiar

    // Filters
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByNameContaining(String name);
    List<Product> findByPriceRange(Double minPrice, Double maxPrice);
}