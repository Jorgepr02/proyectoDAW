package edu.jorge.proyectodaw.config;

import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.entity.OrderDetails;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import edu.jorge.proyectodaw.service.CategoryService;
import edu.jorge.proyectodaw.service.ClientService;
import edu.jorge.proyectodaw.service.OrderService;
import edu.jorge.proyectodaw.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("dev") // Solo se ejecutará en el perfil de desarrollo
    CommandLineRunner initDatabase(
            ClientService clientService,
            ProductService productService,
            CategoryService categoryService,
            OrderService orderService) {

        return args -> {
            // Inicializar clientes
            initClients(clientService);

            // Inicializar productos
            initProducts(productService, categoryService);

            // Inicializar pedidos
            initOrders(orderService, clientService, productService);
        };
    }

    private void initClients(ClientService clientService) {
        Client c1 = new Client(null, "Jorge", "jorge@example.com", "123456789", "Calle Principal", "123", LocalDate.now(), null, null, null);
        Client c2 = new Client(null, "Ana", "ana@example.com", "987654321", "Avenida Secundaria", "456", LocalDate.now(), null, null, null);
        Client c3 = new Client(null, "Luis", "luis@example.com", "456789123", "Plaza Central", "789", LocalDate.now(), null, null, null);
        Client c4 = new Client(null, "Maria", "maria@example.com", "321654987", "Calle Nueva", "321", LocalDate.now(), null, null, null);

        clientService.save(c1);
        clientService.save(c2);
        clientService.save(c3);
        clientService.save(c4);
    }

    private void initProducts(ProductService productService, CategoryService categoryService) {
        Product p1 = new Product("Producto 1", "Descripción del producto 1", 19.99, 100, categoryService.findById(2L));
        Product p2 = new Product("Producto 2", "Descripción del producto 2", 29.99, 50, categoryService.findById(3L));
        Product p3 = new Product("Producto 3", "Descripción del producto 3", 39.99, 75, categoryService.findById(1L));

        productService.save(p1);
        productService.save(p2);
        productService.save(p3);
    }

    private void initOrders(OrderService orderService, ClientService clientService, ProductService productService) {
        // Crear un pedido con sus detalles
        Order order = new Order(null, LocalDate.now(), null, OrderStatus.PENDING,
                PaymentMethod.CREDIT_CARD, "nombre de la calle", "Número de la calle",
                "ANOTACIONES", clientService.findById(2L), null);

        // Crear detalles del pedido
        OrderDetails od1 = new OrderDetails(null, productService.findById(2L), 2, null);
        OrderDetails od2 = new OrderDetails(null, productService.findById(1L), 10, null);

        // Añadir los detalles al pedido
        List<OrderDetails> orderDetailsList = List.of(od1, od2);

        // Guardar el pedido con sus detalles utilizando el servicio
        orderService.createOrderWithDetails(order, orderDetailsList);
    }
}