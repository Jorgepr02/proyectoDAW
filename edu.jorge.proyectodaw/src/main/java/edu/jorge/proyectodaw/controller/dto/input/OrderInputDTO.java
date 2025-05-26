package edu.jorge.proyectodaw.controller.dto.input;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderInputDTO {
    private LocalDate date;
    private Double amount;
    private String orderStatus;
    private String orderPaymentMethod;
    private String shippingNameAddress;
    private String shippingNumberAddress;
    private String notes;
    private Long idClient;
}
