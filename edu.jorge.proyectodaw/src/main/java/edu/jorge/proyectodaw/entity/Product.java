package edu.jorge.proyectodaw.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private Double price;

    @Column(columnDefinition = "int DEFAULT 0")
    private Integer stock;

    @ManyToOne
    @JoinColumn(name = "id_category")
    private Category category;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductFeature> productFeatures;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> review;

    @ElementCollection
    @CollectionTable(
            name = "product_images",
            joinColumns = @JoinColumn(name = "product_id")
    )
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    public Product(Long id){
        this.id = id;
    }

    public Product(String name, String description, Double price, Integer stock, Category category) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
    }
}