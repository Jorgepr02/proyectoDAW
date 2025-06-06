package edu.jorge.proyectodaw.controller.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderSimpleOutputDTO {
    private Long id;
    private LocalDate date;
    private Double amount;
    private String orderStatus;
    private String clientEmail;
}