package edu.jorge.proyectodaw.controller.dto.input;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateInputDTO {

    private String name;

    private String description;

    private Double price;

    private Long idCategory;

    private List<ProductFeatureInputDTO> productFeatures;
}
