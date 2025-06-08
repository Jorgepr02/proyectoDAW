package edu.jorge.proyectodaw.controller.dto.input;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateInputDTO {
    private Long id;
    private String username;
    private String email;
    private String password;
    private List<String> roles;
}