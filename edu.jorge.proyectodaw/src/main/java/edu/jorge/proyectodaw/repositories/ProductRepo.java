package edu.jorge.proyectodaw.repositories;

import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.enums.CategoryType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Product;

import java.util.List;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {
    // findAll y findById ya están implícitos en JpaRepository

    // Búsqueda por ID de categoría
    List<Product> findByCategoryId(Long categoryId);

    // Búsqueda por tipo de categoría
    @Query("SELECT p FROM Product p WHERE p.category.categoryType = :categoryType")
    List<Product> findByCategoryType(@Param("categoryType") CategoryType categoryType);

    // Búsqueda por nombre (contiene)
    List<Product> findByNameContainingIgnoreCase(String name);

    // Búsqueda por rango de precios
    List<Product> findByPriceBetween(Double minPrice, Double maxPrice);
}