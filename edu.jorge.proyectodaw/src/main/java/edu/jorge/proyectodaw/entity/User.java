package edu.jorge.proyectodaw.entity;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Valid
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 20)
    private String username;

    @Column(nullable = false, unique = true)
    @NotBlank
    @Size(max = 50)
    @Email
    private String email;

    @Column(nullable = false)
    @NotBlank
    @Size(min = 6)
    private String password;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(  name = "user_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles = new HashSet<>();

    public User(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public void addRole(Role role) {
        if (roles.contains(role)) {}
        if (roles == null) {
            roles = new HashSet<>();
        }
        roles.add(role);
    }

    public void removeRole(Role role) {
        if (!roles.contains(role)) {}
        if (roles == null) {
            roles = new HashSet<>();
        }
        roles.remove(role);
    }
}