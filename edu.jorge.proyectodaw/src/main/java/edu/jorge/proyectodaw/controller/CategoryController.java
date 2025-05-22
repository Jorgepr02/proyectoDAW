package edu.jorge.proyectodaw.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.jorge.proyectodaw.controller.output.CategorySimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.service.CategoryService;
// import jakarta.websocket.server.PathParam; // Not needed, use Spring's @PathVariable
import org.springframework.web.bind.annotation.PathVariable;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;
    @GetMapping("{id}")
    public ResponseEntity<CategorySimpleOutputDTO> findById(@PathVariable Long id) {
        CategorySimpleOutputDTO categorySimpleOutputDTO = new CategorySimpleOutputDTO();
        Category category = categoryService.findById(id);
        categorySimpleOutputDTO.setName(category.getName());
        categorySimpleOutputDTO.setCategoryType(category.getCategoryType().getDescription());
        return ResponseEntity.ok(categorySimpleOutputDTO);   
    }


}
