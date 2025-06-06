package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.UserInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.UserSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.User;
import edu.jorge.proyectodaw.service.ClientService;
import edu.jorge.proyectodaw.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<List<UserSimpleOutputDTO>> findAll() {
        List<User> users = userService.findAll();
        List<UserSimpleOutputDTO> userDTOs = users.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserSimpleOutputDTO> findById(@PathVariable Long id) {
        User user = userService.findById(id);
        UserSimpleOutputDTO userDTO = convertToDTO(user);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping
    public ResponseEntity<UserSimpleOutputDTO> createUser(@RequestBody UserInputDTO userDTO) {
        User user = convertToEntity(userDTO);
        User createdUser = userService.save(user);
        UserSimpleOutputDTO responseDTO = convertToDTO(createdUser);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserSimpleOutputDTO> updateUser(@PathVariable Long id, @RequestBody UserInputDTO userDTO) {
        User user = convertToEntity(userDTO);
        User updatedUser = userService.update(id, user);
        UserSimpleOutputDTO responseDTO = convertToDTO(updatedUser);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private User convertToEntity(UserInputDTO userDTO) {
        User user = new User();
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());
//        user.setRole(ERole.valueOf(userDTO.getRole().toUpperCase()));
        return user;
    }

    private UserSimpleOutputDTO convertToDTO(User user) {
        UserSimpleOutputDTO dto = new UserSimpleOutputDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        // TODO corregir OUTPUTS DTO DEBIDO A CAMBIO EN LA ENTIDAD USER POR SECURITY
//        dto.setRole(user.getRole().name());
        
//        if (user.getClient() != null) {
//            dto.setClientName(user.getClient().getName());
//        }
        
        return dto;
    }

}
