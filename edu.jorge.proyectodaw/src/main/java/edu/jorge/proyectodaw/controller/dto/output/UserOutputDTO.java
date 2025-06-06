package edu.jorge.proyectodaw.controller.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.stereotype.Service;

@Getter @Service
@NoArgsConstructor @AllArgsConstructor
public class UserOutputDTO {

    private Long id;
    private String username;
    private String email;
    private String roles;
    private Long clientId;
}
