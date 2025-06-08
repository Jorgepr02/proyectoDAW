package edu.jorge.proyectodaw.controller.dto.output;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserSimpleOutputDTO {
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}