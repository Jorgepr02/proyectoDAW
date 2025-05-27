package edu.jorge.proyectodaw.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
public enum PaymentMethod {
    CREDIT_CARD("tarjeta de crédito"),
    PAYPAL("PayPal"),
    BANK_TRANSFER("transferencia bancaria"),;

    private final String method;
}