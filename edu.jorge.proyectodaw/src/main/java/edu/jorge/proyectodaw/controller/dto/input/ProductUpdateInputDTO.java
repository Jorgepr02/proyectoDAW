package edu.jorge.proyectodaw.controller.dto.input;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateInputDTO {

    private String name;

    private String description;

    private Double price;

    private Integer stock;

    private Long idCategory;

    private List<ProductFeatureInputDTO> productFeatures;
}
