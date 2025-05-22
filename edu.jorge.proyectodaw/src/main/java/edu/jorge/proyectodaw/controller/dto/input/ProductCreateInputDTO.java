package edu.jorge.proyectodaw.controller.dto.input;

import java.util.List;

import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.entity.ProductFeature;
import edu.jorge.proyectodaw.entity.Review;
import edu.jorge.proyectodaw.enums.CategoryType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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

    private List<FeatureProductInputDTO> productFeatures;
}
