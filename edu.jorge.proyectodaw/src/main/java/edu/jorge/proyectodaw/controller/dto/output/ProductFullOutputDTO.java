package edu.jorge.proyectodaw.controller.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductFullOutputDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String categoryName;
}
