package edu.jorge.proyectodaw.service;

import java.util.List;
import edu.jorge.proyectodaw.entity.Category;

public interface CategoryService {
    List<Category> findAll();
    Category findById(Long id);
    Category save(Category category);
    Category update(Long id, Category category);
    void delete(Long id);
}
