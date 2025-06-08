package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.UserInputDTO;
import edu.jorge.proyectodaw.controller.dto.input.UserUpdateInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.UserSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Role;
import edu.jorge.proyectodaw.entity.User;
import edu.jorge.proyectodaw.enums.ERole;
import edu.jorge.proyectodaw.repositories.RoleRepo;
import edu.jorge.proyectodaw.service.ClientService;
import edu.jorge.proyectodaw.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private ClientService clientService;
    @Autowired
    private RoleRepo roleRepo;

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

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserSimpleOutputDTO> updateUser(@PathVariable Long id, @RequestBody UserUpdateInputDTO userDTO) {
        User updatedUser = userService.update(id, convertToEntity(userDTO));
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
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRoles(user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toList()));
        return dto;
    }

    private User convertToEntity(UserUpdateInputDTO userDTO) {
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setPassword(userDTO.getPassword());

        // ───────── Asignación de roles ─────────
        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            for (String roleStr : userDTO.getRoles()) {
                if (roleStr == null) continue;
                switch (roleStr.trim().toUpperCase()) {
                    case "ADMIN":
                    case "ROLE_ADMIN":
                        user.addRole(new Role(ERole.ROLE_ADMIN));
                        break;

                    case "CLIENT":
                    case "ROLE_CLIENT":
                        user.addRole(new Role(ERole.ROLE_CLIENT));
                        break;

                    case "USER":
                    case "ROLE_USER":
                    default:
                        user.addRole(new Role(ERole.ROLE_USER));
                        break;
                }
            }
        } else {
            user.addRole(new Role(ERole.ROLE_USER));
        }

        return user;
    }
}
