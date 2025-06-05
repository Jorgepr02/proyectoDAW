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
public class OrderDetailsSimpleOutputDTO {
    private Integer amount;
    private List<ProductSimpleOutputDTO> products;
}
