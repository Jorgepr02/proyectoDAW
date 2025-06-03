package edu.jorge.proyectodaw.controller.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductListOutputDTO {
    private Long id;
    private String name;
    private Double price;
    private List<String> images;
    private String categoryName;
}
