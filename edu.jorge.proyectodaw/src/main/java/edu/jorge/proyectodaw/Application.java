package edu.jorge.proyectodaw;

import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.entity.Order;
import edu.jorge.proyectodaw.entity.OrderDetails;
import edu.jorge.proyectodaw.entity.Product;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import edu.jorge.proyectodaw.repositories.*;
import edu.jorge.proyectodaw.service.CategoryService;
import edu.jorge.proyectodaw.service.ClientService;
import edu.jorge.proyectodaw.service.ProductService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);

        // REPOSITORIOS
            // Repositorio de Clientes
            ClientRepo clientRepo = context.getBean(ClientRepo.class);
            // Repositorio de Pedidos
            OrderRepo orderRepo = context.getBean(OrderRepo.class);
            // Repositorio de Pedidos
            OrderDetailsRepo orderDetailsRepo = context.getBean(OrderDetailsRepo.class);
            // Repositorio de Categoria
            CategoryRepo categoryRepo = context.getBean(CategoryRepo.class);
            // Repositorio de Categoria
            ProductRepo productRepo = context.getBean(ProductRepo.class);

        // SERVICIOS
            // Servicio de Categoria
            CategoryService categoryService = context.getBean(CategoryService.class);
            // Servicio de Product
            ProductService productService = context.getBean(ProductService.class);
            // Servicio de Client
            ClientService clientService = context.getBean(ClientService.class);

        Client c1 = new Client(null, "Jorge", "jorge@example.com", "123456789", "Calle Principal", "123", LocalDate.now(), null, null, null);
        Client c2 = new Client(null, "Ana", "ana@example.com", "987654321", "Avenida Secundaria", "456", LocalDate.now(), null, null, null);
        Client c3 = new Client(null, "Luis", "luis@example.com", "456789123", "Plaza Central", "789", LocalDate.now(), null, null, null);
        Client c4 = new Client(null, "Maria", "maria@example.com", "321654987", "Calle Nueva", "321", LocalDate.now(), null, null, null);

        Client c1Created = clientRepo.save(c1);
        clientRepo.save(c2);
        clientRepo.save(c3);
        clientRepo.save(c4);

        // PRODUCTOS
        Product p1 = new Product(null, "Producto 1", "Descripción del producto 1", 19.99, 100, categoryService.findById(2L), null, null);
        Product p2 = new Product(null, "Producto 2", "Descripción del producto 2", 29.99, 50, categoryService.findById(3L), null, null);
        Product p3 = new Product(null, "Producto 3", "Descripción del producto 3", 39.99, 75, categoryService.findById(1L), null, null);

        productRepo.save(p1);
        productRepo.save(p2);
        productRepo.save(p3);

        // PEDIDOS
        Order o1 = new Order(null, LocalDate.now(), null, OrderStatus.PENDING, PaymentMethod.CREDIT_CARD, "nombre de la calle", "Número de la calle", "ANOTACIONES", clientService.findById(2L), null);
        Order o1Created = orderRepo.save(o1);

        OrderDetails od1 = new OrderDetails(null, productService.findById(2L), 2, null);
        OrderDetails od2 = new OrderDetails(null, productService.findById(1L), 10, null);
        orderDetailsRepo.save(od1);
        orderDetailsRepo.save(od2);

        // TODO ESTO ES DEL SERVICIO DE PEDIDO
        List<OrderDetails> orderDetailsList = List.of(od1, od2);
        o1.setOrderDetails(orderDetailsList);
        Double totalPrice = orderDetailsList.stream()
                .mapToDouble(od -> od.getProduct().getPrice() * od.getQuantity())
                .sum();

        Double truncatedValue = BigDecimal.valueOf(totalPrice)
                .setScale(2, RoundingMode.DOWN)
                .doubleValue();

        o1.setAmount(truncatedValue);

        orderRepo.save(o1);
        od1.setOrder(o1Created);
        od2.setOrder(o1Created);
        orderDetailsRepo.save(od1);
        orderDetailsRepo.save(od2);
	}

    public static void initClientData () {

    }

}
