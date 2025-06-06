package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.controller.dto.input.OrderCreateInputDTO;
import edu.jorge.proyectodaw.controller.dto.input.OrderDetailsCreateInputDTO;
import edu.jorge.proyectodaw.controller.dto.input.OrderInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.OrderDetailsOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.OrderDetailsSimpleOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.OrderSimpleOutputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ProductSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.entity.OrderDetails;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import edu.jorge.proyectodaw.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
                        convertToOrderDetailsOutputDTO(order)
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

    @GetMapping("/client/{idClient}")
    public ResponseEntity<List<?>> findAllByClientId(
            @RequestParam (required = false, defaultValue = "simple") String data,
            @PathVariable Long idClient
    ) {
        List<Order> orders = orderService.findAllByClientId(idClient);

        if (data.equalsIgnoreCase("details")) {
            List<OrderDetailsOutputDTO> orderDetailsOutputDTOS = new ArrayList<>();
            for (Order order : orders) {
                orderDetailsOutputDTOS.add(
                        convertToOrderDetailsOutputDTO(order)
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

    @PostMapping
    public ResponseEntity<OrderSimpleOutputDTO> createOrder(@RequestBody OrderCreateInputDTO orderCreateInputDTO) {
        Order order = convertFromOrderCreateInputDtoToEntity(orderCreateInputDTO);
        Order createdOrder = orderService.create(order);
        OrderSimpleOutputDTO responseDTO = convertToDTO(createdOrder);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderSimpleOutputDTO> updateOrder(@PathVariable Long id, @RequestBody OrderInputDTO orderDTO) {
        Order order = convertFromOrderInputDtoToEntity(orderDTO);
        Order updatedOrder = orderService.update(id, order);
        OrderSimpleOutputDTO responseDTO = convertToDTO(updatedOrder);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Order convertFromOrderInputDtoToEntity(OrderInputDTO orderDTO) {
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

    private Order convertFromOrderCreateInputDtoToEntity(OrderCreateInputDTO orderCreateInputDTO) {
        Order order = new Order();
        order.setDate(LocalDate.now());
        order.setOrderStatus(OrderStatus.PENDING); // Estado inicial por defecto
        order.setShippingNameAddress(orderCreateInputDTO.getShippingNameAddress());
        order.setShippingNumberAddress(orderCreateInputDTO.getShippingNumberAddress());
        order.setNotes(orderCreateInputDTO.getNotes());

        if (orderCreateInputDTO.getIdClient() != null) {
            Client client = new Client();
            client.setId(orderCreateInputDTO.getIdClient());
            order.setClient(client);
        }

        if (orderCreateInputDTO.getDetails() != null) {
            List<OrderDetails> orderDetailsList = new ArrayList<>();
            for (OrderDetailsCreateInputDTO detailDTO : orderCreateInputDTO.getDetails()) {
                OrderDetails orderDetail = new OrderDetails();
                Product product = new Product();
                product.setId(detailDTO.getProductId());
                orderDetail.setProduct(product);
                orderDetail.setQuantity(detailDTO.getAmount());
                orderDetail.setOrder(order); // Relación bidireccional
                orderDetailsList.add(orderDetail);
            }
            order.setOrderDetails(orderDetailsList);
        }

        return order;
    }

    private OrderSimpleOutputDTO convertToDTO(Order order) {
        OrderSimpleOutputDTO dto = new OrderSimpleOutputDTO();
        dto.setId(order.getId());
        dto.setDate(order.getDate());
        dto.setAmount(order.getAmount());
        dto.setOrderStatus(order.getOrderStatus().name());
        
        if (order.getClient() != null) {
            dto.setClientEmail(order.getClient().getEmail());
        }
        
        return dto;
    }

    private OrderDetailsOutputDTO convertToOrderDetailsOutputDTO(Order order) {
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
            List<OrderDetailsSimpleOutputDTO> details = new ArrayList<>();
            for (OrderDetails orderDetail : order.getOrderDetails()) {
                OrderDetailsSimpleOutputDTO detailDTO = new OrderDetailsSimpleOutputDTO();
                detailDTO.setAmount(orderDetail.getQuantity());

                List<ProductSimpleOutputDTO> products = new ArrayList<>();
                Product product = orderDetail.getProduct();
                if (product != null) {
                    products.add(new ProductSimpleOutputDTO(
                            product.getName(),
                            product.getPrice(),
                            product.getCategory().getCategoryType().name()
                    ));
                }
                detailDTO.setProducts(products);

                details.add(detailDTO);
            }
            dto.setDetails(details);
        }

        return dto;
    }
}
