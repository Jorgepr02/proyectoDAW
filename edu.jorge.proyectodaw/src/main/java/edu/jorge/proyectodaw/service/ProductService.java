package edu.jorge.proyectodaw.service;

import java.util.List;
import edu.jorge.proyectodaw.entity.Product;

public interface ProductService {
    List<Product> findAll();
    Product findById(Long id);
    Product save(Product product);
    Product update(Long id, Product product);
    void delete(Long id);
}