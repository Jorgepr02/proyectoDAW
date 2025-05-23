package edu.jorge.proyectodaw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    
}
