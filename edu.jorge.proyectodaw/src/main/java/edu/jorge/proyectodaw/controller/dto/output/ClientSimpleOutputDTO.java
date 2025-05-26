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
public class ClientSimpleOutputDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String typeAddr;
    private String nameAddr;
    private String numberAddr;
    private LocalDate registrationDate;
}