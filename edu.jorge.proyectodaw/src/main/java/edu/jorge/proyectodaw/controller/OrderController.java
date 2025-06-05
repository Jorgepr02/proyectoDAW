package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.OrderInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.OrderDetailsOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.OrderSimpleOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ProductSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import edu.jorge.proyectodaw.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public ResponseEntity<List<?>> findAll(
            @RequestParam (required = false, defaultValue = "simple") String data
    ) {
        List<Order> orders = orderService.findAll();

        if (data.equalsIgnoreCase("details")) {
            List<OrderDetailsOutputDTO> orderDetailsOutputDTOS = new ArrayList<>();
            for (Order order : orders) {
                orderDetailsOutputDTOS.add(
                        convertToOrderDetailsDTO(order)
                );
            }
            return ResponseEntity.ok(orderDetailsOutputDTOS);
        }

        List<OrderSimpleOutputDTO> orderDTOs = new ArrayList<>();
        for (Order order : orders) {
            OrderSimpleOutputDTO dto = convertToDTO(order);
            orderDTOs.add(dto);
        }
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
        dto.setDate(order.getDate());
        dto.setAmount(order.getAmount());
        dto.setOrderStatus(order.getOrderStatus().name());
        
        if (order.getClient() != null) {
            dto.setClientEmail(order.getClient().getEmail());
        }
        
        return dto;
    }

    private OrderDetailsOutputDTO convertToOrderDetailsDTO(Order order) {
        OrderDetailsOutputDTO dto = new OrderDetailsOutputDTO();
        dto.setId(order.getId());
        dto.setDate(order.getDate());
        dto.setAmount(order.getAmount());
        dto.setOrderStatus(order.getOrderStatus().name());
        dto.setOrderPaymentMethod(order.getOrderPaymentMethod().name());
        dto.setShippingNameAddress(order.getShippingNameAddress());
        dto.setShippingNumberAddress(order.getShippingNumberAddress());
        dto.setNotes(order.getNotes());

        if (order.getClient() != null) {
            dto.setClientEmail(order.getClient().getEmail());
        }

        if (order.getOrderDetails() != null) {
            List<ProductSimpleOutputDTO> products = new ArrayList<>();
            order.getOrderDetails().forEach(orderDetail -> {
                ProductSimpleOutputDTO productDTO = new ProductSimpleOutputDTO(
                    orderDetail.getProduct().getName(),
                    orderDetail.getProduct().getPrice(),
                    orderDetail.getProduct().getCategory().getCategoryType().name()
                );
                products.add(productDTO);
            });
            dto.setProducts(products);
        }

        return dto;
    }
}
