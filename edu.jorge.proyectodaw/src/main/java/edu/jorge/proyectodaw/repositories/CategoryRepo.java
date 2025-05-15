package edu.jorge.proyectodaw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Category;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {
    // Custom query methods can be defined here if needed
    // For example, find by name or type
    // List<Category> findByName(String name);
    // List<Category> findByCategoryType(CategoryType categoryType);

}
