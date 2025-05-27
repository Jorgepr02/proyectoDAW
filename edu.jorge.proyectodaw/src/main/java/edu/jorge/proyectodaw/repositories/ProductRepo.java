package edu.jorge.proyectodaw.repositories;

import edu.jorge.proyectodaw.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
//    Product findbyCategory(CategoryType categoryType, );
}
