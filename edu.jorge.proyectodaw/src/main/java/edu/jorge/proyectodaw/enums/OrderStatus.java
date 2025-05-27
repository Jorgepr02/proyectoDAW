package edu.jorge.proyectodaw.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
public enum OrderStatus {
    PENDING("Pendiente"),
    PROCESSING("En proceso"),
    SHIPPED("Enviado"),
    DELIVERED("Entregado"),
    CANCELLED("Cancelado");

    private final String status;
}