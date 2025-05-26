package edu.jorge.proyectodaw.service;

import edu.jorge.proyectodaw.controller.dto.input.ProductCreateInputDTO;
import edu.jorge.proyectodaw.entity.Product;

import java.util.List;

public interface ProductService {
    List<Product> findAll();
    Product findById(Long id);
    Product save(Product product);
    Product update(Long id, Product product);
    void delete(Long id);

    // DTO
    Product save(ProductCreateInputDTO product);
}