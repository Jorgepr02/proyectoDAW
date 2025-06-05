package edu.jorge.proyectodaw.service;

import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.entity.OrderDetails;

import java.util.List;

public interface OrderService {
    List<Order> findAll();
    Order findById(Long id);
    Order save(Order order);
    Order create(Order order);
    Order update(Long id, Order order);
    void delete(Long id);

    List<Order> findAllByClientId(Long clientId);
    Order createOrderWithDetails(Order order, List<OrderDetails> orderDetails);
    Order markAsPaid(Long id, String paymentIntentId, String paymentStatus);
}
