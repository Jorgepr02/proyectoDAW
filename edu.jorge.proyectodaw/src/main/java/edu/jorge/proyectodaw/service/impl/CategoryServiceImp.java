package edu.jorge.proyectodaw.service.impl;

import java.util.List;

import edu.jorge.proyectodaw.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.repositories.CategoryRepo;
import jakarta.persistence.EntityNotFoundException;

@Service
public class CategoryServiceImp implements CategoryService {

    @Autowired
    private CategoryRepo categoryRepo;

    @Override
    public List<Category> findAll() {
        return categoryRepo.findAll();
    }

    @Override
    public Category findById(Long id) {
        return categoryRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Categoría no encontrada con id: " + id));
    }

    @Override
    public Category save(Category category) {
        return categoryRepo.save(category);
    }

    @Override
    public Category update(Long id, Category category) {
        Category existingCategory = findById(id);
        existingCategory.setName(category.getName());
        existingCategory.setDescription(category.getDescription());
        existingCategory.setCategoryType(category.getCategoryType());
        return categoryRepo.save(existingCategory);
    }

    @Override
    public void delete(Long id) {
        Category category = findById(id);
        categoryRepo.delete(category);
    }

}