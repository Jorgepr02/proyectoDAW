package edu.jorge.proyectodaw.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

import edu.jorge.proyectodaw.entity.OrderDetails;
import edu.jorge.proyectodaw.service.OrderService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.repositories.OrderRepo;
import edu.jorge.proyectodaw.entity.OrderDetails;
import java.util.List;
import edu.jorge.proyectodaw.repositories.OrderDetailsRepo;
import jakarta.persistence.EntityNotFoundException;

@Service
public class OrderServiceImp implements OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private OrderDetailsRepo orderDetailsRepo;

    @Override
    public List<Order> findAll() {
        return orderRepo.findAll();
    }

    @Override
    public Order findById(Long id) {
        return orderRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Pedido no encontrado con id: " + id));
    }

    @Override
    public Order save(Order order) {
        return orderRepo.save(order);
    }

    @Override
    public Order update(Long id, Order order) {
        Order existingOrder = findById(id);
        existingOrder.setDate(order.getDate());
        existingOrder.setAmount(order.getAmount());
        existingOrder.setOrderStatus(order.getOrderStatus());
        existingOrder.setOrderPaymentMethod(order.getOrderPaymentMethod());
        existingOrder.setShippingNameAddress(order.getShippingNameAddress());
        existingOrder.setShippingNumberAddress(order.getShippingNumberAddress());
        existingOrder.setNotes(order.getNotes());
        existingOrder.setClient(order.getClient());
        return orderRepo.save(existingOrder);
    }

    @Override
    public void delete(Long id) {
        Order order = findById(id);
        orderRepo.delete(order);
    }

    @Override
    @Transactional
    public Order createOrderWithDetails(Order order, List<OrderDetails> orderDetails) {
        // Calcular el precio total
        Double totalPrice = orderDetails.stream()
                .mapToDouble(od -> od.getProduct().getPrice() * od.getQuantity())
                .sum();

        Double truncatedValue = BigDecimal.valueOf(totalPrice)
                .setScale(2, RoundingMode.DOWN)
                .doubleValue();

        order.setAmount(truncatedValue);

        // Guardar el pedido
        Order savedOrder = orderRepo.save(order);

        // Asociar el pedido con los detalles y guardarlos
        for (OrderDetails detail : orderDetails) {
            detail.setOrder(savedOrder);
            orderDetailsRepo.save(detail);
        }

        return savedOrder;
    }
}
