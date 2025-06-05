package edu.jorge.proyectodaw.service.impl;

import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.entity.OrderDetails;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.repositories.OrderDetailsRepo;
import edu.jorge.proyectodaw.repositories.OrderRepo;
import edu.jorge.proyectodaw.service.ClientService;
import edu.jorge.proyectodaw.service.OrderService;
import edu.jorge.proyectodaw.service.ProductService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImp implements OrderService {

    // Repositorios
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    private OrderDetailsRepo orderDetailsRepo;

    // Servicios
    @Autowired
    private ClientService clientService;
    @Autowired
    private ProductService productService;

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
    @Transactional
    public Order create(Order order) {
        order.setDate(LocalDate.now());

        List<OrderDetails> orderDetails = order.getOrderDetails();
        List<OrderDetails> orderDetailsCreated = new ArrayList<>();

        for (OrderDetails od : orderDetails) {
            if (od.getProduct() == null || od.getProduct().getId() == null) {
                throw new IllegalArgumentException("El producto no puede ser nulo o debe tener un ID válido.");
            }
            od.setProduct(
                    productService.findById(
                            od.getProduct().getId()
                    )
            );
            if (od.getQuantity() <= 0) {
                throw new IllegalArgumentException("La cantidad del producto debe ser mayor que cero.");
            }
            orderDetailsCreated.add(orderDetailsRepo.save(od));
            od.setOrder(order);
        }
        order.setOrderDetails(orderDetailsCreated);
        order.setAmount(
                calculateTotalPrice(
                        order.getOrderDetails()
                )
        );
        order.setOrderStatus(OrderStatus.NEW);
        order.setClient(
                clientService.findById(
                        order.getClient().getId()
                )
        );
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
    public List<Order> findAllByClientId(Long clientId) {
        return orderRepo.findByClientId(clientId);
    }

    @Override
    @Transactional
    public Order createOrderWithDetails(Order order, List<OrderDetails> orderDetails) {
        // Calcular el precio total
        Double totalPrice = 0.0;
        for (OrderDetails od : orderDetails) {
            totalPrice += od.getProduct().getPrice() * od.getQuantity();
        }

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

    @Override
    public Order markAsPaid(Long id, String paymentIntentId, String paymentStatus) {
        Order order = findById(id);
        order.setOrderStatus(OrderStatus.PAID);
        order.setPaymentIntentId(paymentIntentId);
        order.setStripePaymentStatus(paymentStatus);

        return orderRepo.save(order);
    }

    public Double calculateTotalPrice(List<OrderDetails> orderDetails) {
        return orderDetails.stream()
                .mapToDouble(od -> od.getProduct().getPrice() * od.getQuantity())
                .reduce(0.0, Double::sum);
    }
}
