package edu.jorge.proyectodaw.controller;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import edu.jorge.proyectodaw.entity.OrderDetails;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.jorge.proyectodaw.controller.dto.input.OrderInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.OrderSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import edu.jorge.proyectodaw.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderSimpleOutputDTO>> findAll() {
        List<Order> orders = orderService.findAll();
        List<OrderSimpleOutputDTO> orderDTOs = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderSimpleOutputDTO> findById(@PathVariable Long id) {
        Order order = orderService.findById(id);
        OrderSimpleOutputDTO orderDTO = convertToDTO(order);
        return ResponseEntity.ok(orderDTO);
    }

    @PostMapping
    public ResponseEntity<OrderSimpleOutputDTO> createOrder(@RequestBody OrderInputDTO orderDTO) {
        Order order = convertToEntity(orderDTO);
        Order createdOrder = orderService.save(order);
        OrderSimpleOutputDTO responseDTO = convertToDTO(createdOrder);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderSimpleOutputDTO> updateOrder(@PathVariable Long id, @RequestBody OrderInputDTO orderDTO) {
        Order order = convertToEntity(orderDTO);
        Order updatedOrder = orderService.update(id, order);
        OrderSimpleOutputDTO responseDTO = convertToDTO(updatedOrder);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Order convertToEntity(OrderInputDTO orderDTO) {
        Order order = new Order();
        order.setDate(orderDTO.getDate());
        order.setAmount(orderDTO.getAmount());
        order.setOrderStatus(OrderStatus.valueOf(orderDTO.getOrderStatus().toUpperCase()));
        order.setOrderPaymentMethod(PaymentMethod.valueOf(orderDTO.getOrderPaymentMethod().toUpperCase()));
        order.setShippingNameAddress(orderDTO.getShippingNameAddress());
        order.setShippingNumberAddress(orderDTO.getShippingNumberAddress());
        order.setNotes(orderDTO.getNotes());
        
        if (orderDTO.getIdClient() != null) {
            Client client = new Client();
            client.setId(orderDTO.getIdClient());
            order.setClient(client);
        }
        
        return order;
    }

    private OrderSimpleOutputDTO convertToDTO(Order order) {
        OrderSimpleOutputDTO dto = new OrderSimpleOutputDTO();
        dto.setId(order.getId());
        dto.setDate(order.getDate());
        dto.setAmount(order.getAmount());
        dto.setOrderStatus(order.getOrderStatus().name());
        dto.setOrderPaymentMethod(order.getOrderPaymentMethod().name());
        dto.setShippingNameAddress(order.getShippingNameAddress());
        dto.setShippingNumberAddress(order.getShippingNumberAddress());
        dto.setNotes(order.getNotes());
        
        if (order.getClient() != null) {
            dto.setClientName(order.getClient().getName());
        }
        
        return dto;
    }
}
