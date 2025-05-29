package edu.jorge.proyectodaw.service;

import java.util.List;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.entity.OrderDetails;

public interface OrderService {
    List<Order> findAll();
    Order findById(Long id);
    Order save(Order order);
    Order update(Long id, Order order);
    void delete(Long id);
    Order createOrderWithDetails(Order order, List<OrderDetails> orderDetails);
}
