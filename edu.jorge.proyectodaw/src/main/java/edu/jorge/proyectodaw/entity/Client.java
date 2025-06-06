package edu.jorge.proyectodaw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "client")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;

    @Column(name = "name_addr")
    private String nameAddr;

    @Column(name = "number_addr")
    private String numberAddr;

    @Column(name = "registration_date")
    private LocalDate registrationDate;

    @OneToOne
    @JoinColumn(name = "id_user")
    private User user;

    @OneToMany(mappedBy = "client")
    private List<Review> review;

    @OneToMany(mappedBy = "client")
    private List<Order> orders;

    public Client(String name, String email, String phone, String nameAddr, String numberAddr, User user) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.nameAddr = nameAddr;
        this.numberAddr = numberAddr;
        this.user = user;
    }

    public Client(String email, User user) {
        this.email = email;
        this.user = user;
    }
}