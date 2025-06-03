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
public class ProductFullOutputDTO {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private String categoryName;
    private List<FeatureProductSimpleOutputDTO> features;
    private List<ReviewSimpleOutputDTO> reviews;
    private List<String> images;
}
