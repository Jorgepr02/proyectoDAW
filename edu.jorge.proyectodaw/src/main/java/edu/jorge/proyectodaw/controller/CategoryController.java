package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.output.CategoryFullOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.CategorySimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryFullOutputDTO>> findAll() {
        List<CategoryFullOutputDTO> categoryFullOutputDTOList = new ArrayList<>();
        List<Category> categoryList = categoryService.findAll();

        for (Category category : categoryList) {
            CategoryFullOutputDTO categoryFullOutputDTO = convertToFullDTO(category);
            categoryFullOutputDTOList.add(categoryFullOutputDTO);
        }

        return ResponseEntity.ok(categoryFullOutputDTOList);
    }

    @GetMapping("{id}")
    public ResponseEntity<CategorySimpleOutputDTO> findById(@PathVariable Long id) {
        CategorySimpleOutputDTO categorySimpleOutputDTO = new CategorySimpleOutputDTO();
        Category category = categoryService.findById(id);
        categorySimpleOutputDTO.setName(category.getName());
        categorySimpleOutputDTO.setCategoryType(category.getCategoryType().getDescription());
        return ResponseEntity.ok(categorySimpleOutputDTO);
    }

    private CategorySimpleOutputDTO convertToDTO(Category category) {
        CategorySimpleOutputDTO dto = new CategorySimpleOutputDTO();

        dto.setName(category.getName());
        if (category.getCategoryType() != null) {
            dto.setCategoryType(category.getCategoryType().getDescription());
        } else {
            dto.setCategoryType("No category type");
        }

        return dto;
    }

    private CategoryFullOutputDTO convertToFullDTO(Category category) {
        CategoryFullOutputDTO dto = new CategoryFullOutputDTO();

        dto.setId(category.getId());
        dto.setName(category.getName());
        if (category.getCategoryType() != null) {
            dto.setCategoryType(category.getCategoryType().getDescription().toUpperCase());
        } else {
            dto.setCategoryType("No category type");
        }

        return dto;
    }

}
