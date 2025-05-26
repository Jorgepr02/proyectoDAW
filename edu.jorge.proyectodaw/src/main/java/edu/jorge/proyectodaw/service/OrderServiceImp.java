package edu.jorge.proyectodaw.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.repositories.OrderRepo;
import jakarta.persistence.EntityNotFoundException;

@Service
public class OrderServiceImp implements OrderService {

    @Autowired
    private OrderRepo orderRepo;

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
}
