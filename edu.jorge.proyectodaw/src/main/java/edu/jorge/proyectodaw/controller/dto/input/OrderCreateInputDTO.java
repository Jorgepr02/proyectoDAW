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
public class OrderCreateInputDTO {

    private String shippingNameAddress;
    private String shippingNumberAddress;
    private String notes;
    private Long idClient;

    List<OrderDetailsCreateInputDTO> details;
}
