package edu.jorge.proyectodaw.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

@ToString
@Getter
@AllArgsConstructor
public enum CategoryType {
    SNOWBOARD("Snowboard"),
    SKI("Ski"),
    ACCESORY("Accessory"),;
    
    private final String description;
    
}