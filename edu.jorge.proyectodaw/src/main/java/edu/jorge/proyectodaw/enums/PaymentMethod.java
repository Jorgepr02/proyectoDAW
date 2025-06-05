package edu.jorge.proyectodaw.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
public enum PaymentMethod {
    CREDIT_CARD("tarjeta de crédito"),
    BANK_TRANSFER("transferencia bancaria"),
    STRIPE("Stripe"),;

    private final String method;
}