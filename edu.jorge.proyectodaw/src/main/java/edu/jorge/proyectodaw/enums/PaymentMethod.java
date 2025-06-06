package edu.jorge.proyectodaw.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
public enum PaymentMethod {
    STRIPE("Stripe");

    private final String method;
}