package edu.jorge.proyectodaw.entity;

import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "orders") 
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = true)
    private Double amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus orderStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_payment_method")
    private PaymentMethod orderPaymentMethod;

    @Column(name = "shipping_name_address")
    private String shippingNameAddress;

    @Column(name = "shipping_number_address")
    private String shippingNumberAddress;

    @Column(length = 50)
    private String notes;

    @ManyToOne
    @JoinColumn(name = "id_client")
    private Client client;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetails> orderDetails;

    @Column(name = "stripe_payment_intent_id")
    private String paymentIntentId;

    @Column(name = "stripe_payment_status")
    private String stripePaymentStatus;

    public Order(LocalDate date, OrderStatus orderStatus, String shippingNameAddress, String shippingNumberAddress, String notes, Client client) {
        this.date = date;
        this.orderStatus = orderStatus;
        this.shippingNameAddress = shippingNameAddress;
        this.shippingNumberAddress = shippingNumberAddress;
        this.notes = notes;
        this.client = client;
    }
}
