package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.LoginRequest;
import edu.jorge.proyectodaw.controller.dto.input.RegisterRequest;
import edu.jorge.proyectodaw.controller.dto.input.Valid;
import edu.jorge.proyectodaw.controller.dto.output.LoginOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.MessageResponse;
import edu.jorge.proyectodaw.controller.dto.output.UserOutputDTO;
import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.entity.Role;
import edu.jorge.proyectodaw.entity.User;
import edu.jorge.proyectodaw.enums.ERole;
import edu.jorge.proyectodaw.repositories.RoleRepo;
import edu.jorge.proyectodaw.repositories.UserRepo;
import edu.jorge.proyectodaw.security.jwt.JwtUtils;
import edu.jorge.proyectodaw.service.ClientService;
import edu.jorge.proyectodaw.service.impl.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepo userRepository;

    @Autowired
    RoleRepo roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @Autowired
    ClientService clientService;

    @PostMapping("/login")
    public ResponseEntity<LoginOutputDTO> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        Client client = clientService.findByUserId(userDetails.getId());
        Long clientId = client.getId();

        return ResponseEntity.ok(
                new LoginOutputDTO(
                        jwt,
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getEmail(),
                        roles,
                        clientId
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User(registerRequest.getUsername(),
                registerRequest.getEmail(),
                encoder.encode(registerRequest.getPassword()));

        Set<String> strRoles = registerRequest.getRole();
        Set<Role> roles = new HashSet<>();

        if (strRoles == null) {
            Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role) {
                    case "admin":
                        Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(adminRole);

                        break;
                    case "client":
                        Role modRole = roleRepository.findByName(ERole.ROLE_CLIENT)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(modRole);

                        break;
                    default:
                        Role userRole = roleRepository.findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                        roles.add(userRole);
                }
            });
        }

        user.setRoles(roles);
        User createdUser = userRepository.save(user);
        Client createdClient = clientService.create(new Client(user.getEmail(), createdUser));

        return ResponseEntity
                .ok(
                        convertToUserOutputDTO(createdUser, createdClient)
        );
    }

    private UserOutputDTO convertToUserOutputDTO(User user, Client client) {
        return new UserOutputDTO(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.joining(", ")),
                client.getId()
        );
    }
}
