package edu.jorge.proyectodaw.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "wish_lists")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class WishList {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany
    @JoinTable(
            name = "wish_list_products",
            joinColumns = @JoinColumn(name = "wish_list_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private List<Product> products = new ArrayList<>();

    public WishList(User user) {
        this.user = user;
        this.products = new ArrayList<>();
    }

    public void addProduct(Product product) {
        if (this.products == null) {
            this.products = new ArrayList<>();
        }
        if (!this.products.contains(product)) {
            this.products.add(product);
        }
    }

    public void removeProduct(Product product) {
        if (this.products != null) {
            this.products.remove(product);
        }
    }
}
