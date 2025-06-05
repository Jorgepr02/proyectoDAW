package edu.jorge.proyectodaw.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
public enum OrderStatus {
    PENDING("Pendiente"),
    SHIPPED("Enviado"),
    DELIVERED("Entregado"),
    CANCELLED("Cancelado"),
    PAID("Pagado"),;

    private final String status;
}