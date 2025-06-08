package edu.jorge.proyectodaw.controller.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailsOutputDTO {
    private Long id;
    private LocalDate date;
    private Double amount;
    private String orderStatus;
    private String orderPaymentMethod;
    private String shippingNameAddress;
    private String shippingNumberAddress;
    private String notes;
    private String clientName;
    private String clientEmail;

    List<OrderDetailsSimpleOutputDTO> details;
}