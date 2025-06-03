package edu.jorge.proyectodaw.config;

import edu.jorge.proyectodaw.entity.*;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.enums.PaymentMethod;
import edu.jorge.proyectodaw.service.*;
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
            OrderService orderService,
            FeatureService featureService) {

        return args -> {
            // Inicializar clientes
            initClients(clientService);

            // Inicializar productos
//            initProducts(productService, categoryService);
            initProductsRelation(productService, categoryService, clientService, featureService);

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

    private void initProductsRelation(ProductService productService, CategoryService categoryService, ClientService clientService, FeatureService featureService) {
        // Crear categorías
        Category snowboardCategory = categoryService.findById(1L);
        Category skiCategory = categoryService.findById(2L);
        Category accessoryCategory = categoryService.findById(3L);

        // Crear productos
        Product snowboard = new Product("Tabla Snowboard", "Tabla profesional para snowboard", 199.99, 20, snowboardCategory);
        Product skiBoots = new Product("Botas Ski", "Botas cómodas y resistentes para ski", 129.99, 50, skiCategory);
        Product sunglasses = new Product("Gafas de Sol", "Gafas de sol para deportes extremos", 49.99, 100, accessoryCategory);

        // Agregar características a los productos
        ProductFeature feature11 = new ProductFeature(snowboard, featureService.findById(1L), 2);
        ProductFeature feature12 = new ProductFeature(snowboard, featureService.findById(2L), 2);
        ProductFeature feature13 = new ProductFeature(snowboard, featureService.findById(3L), 2);
        ProductFeature feature14 = new ProductFeature(snowboard, featureService.findById(4L), 2);

        ProductFeature feature21 = new ProductFeature(skiBoots, featureService.findById(1L), 3);
        ProductFeature feature22 = new ProductFeature(skiBoots, featureService.findById(2L), 3);
        ProductFeature feature23 = new ProductFeature(skiBoots, featureService.findById(3L), 3);
        ProductFeature feature24 = new ProductFeature(skiBoots, featureService.findById(4L), 3);

        ProductFeature feature31 = new ProductFeature(sunglasses, featureService.findById(1L), 5);
        ProductFeature feature32 = new ProductFeature(sunglasses, featureService.findById(2L), 5);
        ProductFeature feature33 = new ProductFeature(sunglasses, featureService.findById(3L), 5);
        ProductFeature feature34 = new ProductFeature(sunglasses, featureService.findById(4L), 5);

        snowboard.setProductFeatures(List.of(feature11,feature12, feature13, feature14));
        skiBoots.setProductFeatures(List.of(feature21,feature22, feature23, feature24));
        sunglasses.setProductFeatures(List.of(feature31,feature32, feature33, feature34));

        // Agregar imágenes a los productos
        List<String> defaultImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904516/Celine_Pirris_pqisbu.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Disluv_l5iayv.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903377/White_Fury_rw4ugu.png"
        );

        snowboard.setImages(defaultImages);
        skiBoots.setImages(defaultImages);
        sunglasses.setImages(defaultImages);

        // Agregar reseñas a los productos
        Review review1 = new Review(5.0,"Excelente tabla", snowboard, clientService.findById(1L));
        Review review2 = new Review(4.0,"Muy cómodas", skiBoots, clientService.findById(2L));
        Review review3 = new Review(5.0,"Protegen bien del sol", sunglasses, clientService.findById(2L));

        snowboard.setReview(List.of(review1));
        skiBoots.setReview(List.of(review2));
        sunglasses.setReview(List.of(review3));

        // Guardar productos
        productService.save(snowboard);
        productService.save(skiBoots);
        productService.save(sunglasses);
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