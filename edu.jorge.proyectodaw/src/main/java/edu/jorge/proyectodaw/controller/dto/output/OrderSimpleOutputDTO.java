package edu.jorge.proyectodaw.controller.dto.output;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderSimpleOutputDTO {
    private Long id;
    private LocalDate date;
    private Double amount;
    private String orderStatus;
    private String orderPaymentMethod;
    private String shippingNameAddress;
    private String shippingNumberAddress;
    private String notes;
    private String clientEmail;
}