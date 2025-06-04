package edu.jorge.proyectodaw.controller.dto.input;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
public class WishListPatchInputDTO {

    private Long userId;
    private Long productId;
}
