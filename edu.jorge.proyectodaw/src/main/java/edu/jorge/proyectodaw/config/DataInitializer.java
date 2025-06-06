package edu.jorge.proyectodaw.config;

import edu.jorge.proyectodaw.entity.*;
import edu.jorge.proyectodaw.enums.OrderStatus;
import edu.jorge.proyectodaw.repositories.RoleRepo;
import edu.jorge.proyectodaw.service.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Bean
    @Profile("dev") // Solo se ejecutará en el perfil de desarrollo
    CommandLineRunner initDatabase(
            ClientService clientService,
            ProductService productService,
            CategoryService categoryService,
            OrderService orderService,
            FeatureService featureService,
            RoleRepo roleRepo,
            UserService userService
    ) {

        return args -> {
            // Inicializar clientes
            initClients(clientService);

            // Inicializar productos
//            initProducts(productService, categoryService);
            initProductsRelation(productService, categoryService, clientService, featureService);

            // Inicializar pedidos
            initOrders(orderService, clientService, productService);

            // Inicializar usuarios
            initUsers(userService, roleRepo);
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

        // Crear productos de snowboard
        Product cosmicx = new Product("Cosmic X", "La tabla Cosmic X es una leyenda en el mundo del snowboard. Diseñada para riders avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 599.99, 20, snowboardCategory);
        Product divinium = new Product("Divinium", "La tabla Divinium es una leyenda en el mundo del snowboard. Diseñada para riders avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 669.99, 10, snowboardCategory);
        Product vanillaluv = new Product("Vanilla Luv", "La tabla Vanilla Luv es una leyenda en el mundo del snowboard. Diseñada para riders avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 339.99, 20, snowboardCategory);
        Product kaizen = new Product("Kaizen", "La tabla Kaizen es una leyenda en el mundo del snowboard. Diseñada para riders avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 399.99, 20, snowboardCategory);
        
        // Crear productos de esquí
        Product cosmicy = new Product("Cosmic Y", "Los esquís Cosmic Y son una leyenda en el mundo del esquí. Diseñados para esquiadores avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 399.99, 20, skiCategory);
        Product flame = new Product("Flame", "Los esquís Flame son una leyenda en el mundo del esquí. Diseñados para esquiadores avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 299.99, 20, skiCategory);
        Product vanilladisluv = new Product("Vanilla Disluv", "Los esquís Vanilla Disluv son una leyenda en el mundo del esquí. Diseñados para esquiadores avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 339.99, 20, skiCategory);
        Product mikuseina = new Product("Mikuseína", "Los esquís Mikuseína son una leyenda en el mundo del esquí. Diseñados para esquiadores avanzados que buscan máximo rendimiento y respuesta precisa. Con tecnología Carbon Highlight y núcleo FSC™ Certified Super Fly II™ para una experiencia inigualable en la montaña.", 399.99, 20, skiCategory);

        // Crear productos de accesorios
        Product gafasSnow = new Product("Gafas de Snow Antiniebla", "Gafas de snowboard de alta calidad con tecnología antiniebla avanzada. Lentes intercambiables y protección UV 100%. Marco resistente y ajuste cómodo para largas sesiones en la montaña.", 49.99, 50, accessoryCategory);
        Product guantesTermicos = new Product("Guantes Térmicos", "Guantes térmicos de snowboard con aislamiento superior y membrana impermeable. Palma reforzada con grip antideslizante y ajuste de muñeca para máxima protección y comodidad.", 35.50, 30, accessoryCategory);
        Product botasSnowboard = new Product("Botas de Snowboard", "Botas de snowboard profesionales con sistema de atado rápido BOA. Liner termoformable y suela Vibram para máxima comodidad y rendimiento en cualquier terreno.", 109.90, 25, accessoryCategory);

        // Agregar características a los productos
        ProductFeature feature11 = new ProductFeature(cosmicx, featureService.findById(1L), 4);
        ProductFeature feature12 = new ProductFeature(cosmicx, featureService.findById(2L), 5);
        ProductFeature feature13 = new ProductFeature(cosmicx, featureService.findById(3L), 5);
        ProductFeature feature14 = new ProductFeature(cosmicx, featureService.findById(4L), 5);

        ProductFeature feature21 = new ProductFeature(divinium, featureService.findById(1L), 5);
        ProductFeature feature22 = new ProductFeature(divinium, featureService.findById(2L), 5);
        ProductFeature feature23 = new ProductFeature(divinium, featureService.findById(3L), 4);
        ProductFeature feature24 = new ProductFeature(divinium, featureService.findById(4L), 5);

        ProductFeature feature31 = new ProductFeature(vanillaluv, featureService.findById(1L), 4);
        ProductFeature feature32 = new ProductFeature(vanillaluv, featureService.findById(2L), 3);
        ProductFeature feature33 = new ProductFeature(vanillaluv, featureService.findById(3L), 4);
        ProductFeature feature34 = new ProductFeature(vanillaluv, featureService.findById(4L), 4);

        ProductFeature feature41 = new ProductFeature(kaizen, featureService.findById(1L), 4);
        ProductFeature feature42 = new ProductFeature(kaizen, featureService.findById(2L), 5);
        ProductFeature feature43 = new ProductFeature(kaizen, featureService.findById(3L), 4);
        ProductFeature feature44 = new ProductFeature(kaizen, featureService.findById(4L), 4);

        ProductFeature feature51 = new ProductFeature(cosmicy, featureService.findById(1L), 4);
        ProductFeature feature52 = new ProductFeature(cosmicy, featureService.findById(2L), 5);
        ProductFeature feature53 = new ProductFeature(cosmicy, featureService.findById(3L), 5);
        ProductFeature feature54 = new ProductFeature(cosmicy, featureService.findById(4L), 5);

        ProductFeature feature61 = new ProductFeature(flame, featureService.findById(1L), 5);
        ProductFeature feature62 = new ProductFeature(flame, featureService.findById(2L), 5);
        ProductFeature feature63 = new ProductFeature(flame, featureService.findById(3L), 4);
        ProductFeature feature64 = new ProductFeature(flame, featureService.findById(4L), 5);

        ProductFeature feature71 = new ProductFeature(vanilladisluv, featureService.findById(1L), 4);
        ProductFeature feature72 = new ProductFeature(vanilladisluv, featureService.findById(2L), 3);
        ProductFeature feature73 = new ProductFeature(vanilladisluv, featureService.findById(3L), 4);
        ProductFeature feature74 = new ProductFeature(vanilladisluv, featureService.findById(4L), 4);

        ProductFeature feature81 = new ProductFeature(mikuseina, featureService.findById(1L), 4);
        ProductFeature feature82 = new ProductFeature(mikuseina, featureService.findById(2L), 5);
        ProductFeature feature83 = new ProductFeature(mikuseina, featureService.findById(3L), 4);
        ProductFeature feature84 = new ProductFeature(mikuseina, featureService.findById(4L), 4);

        cosmicx.setProductFeatures(List.of(feature11, feature12, feature13, feature14));
        divinium.setProductFeatures(List.of(feature21, feature22, feature23, feature24));
        vanillaluv.setProductFeatures(List.of(feature31, feature32, feature33, feature34));
        kaizen.setProductFeatures(List.of(feature41 ,feature42, feature43, feature44));
        cosmicy.setProductFeatures(List.of(feature51, feature52, feature53, feature54));
        flame.setProductFeatures(List.of(feature61, feature62, feature63, feature64));
        vanilladisluv.setProductFeatures(List.of(feature71, feature72, feature73, feature74));
        mikuseina.setProductFeatures(List.of(feature81 ,feature82, feature83, feature84));

        // Agregar imágenes a los productos
        List<String> cosmicxImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748935575/CosmicX_xfvdog.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/model_3_uhc9dd.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/model_1_dfrjf4.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/model_2_dhavwg.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/model_gv4ddo.png"
        );
        List<String> diviniumImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904508/Divinium_Fallen_gr7oya.png"
        );
        List<String> vanillaluvImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Luv_red_ckwphd.png"
        );
        List<String> kaizenImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904509/Kaizen_egtrjx.png"
        );
        List<String> cosmicyImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903377/Cosmic_Y_utppmw.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1749202226/model_5_qerpoi.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1749202226/model_4_iielcx.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1749202226/model_7_jtmbu6.png",
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1749202226/model_6_fppfql.png"
        );
        List<String> flameImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904514/Flame_red_uepay6.png"
        );
        List<String> vanilladisluvImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Vanilla_Disluv_l5iayv.png"
        );
        List<String> mikuseinaImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903376/Mikuseina_hnp9ho.png"
        );

        // Imágenes para accesorios
        List<String> gafasSnowImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Gafas_ch5po3.png"
        );
        List<String> guantesTermicosImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748904515/Guantes_p94a8p.png"
        );
        List<String> botasSnowboardImages = List.of(
                "https://res.cloudinary.com/dluvwj5lo/image/upload/v1748903375/botas_kl6eqm.png"
        );

        cosmicx.setImages(cosmicxImages);
        divinium.setImages(diviniumImages);
        vanillaluv.setImages(vanillaluvImages);
        kaizen.setImages(kaizenImages);
        cosmicy.setImages(cosmicyImages);
        flame.setImages(flameImages);
        vanilladisluv.setImages(vanilladisluvImages);
        mikuseina.setImages(mikuseinaImages);
        gafasSnow.setImages(gafasSnowImages);
        guantesTermicos.setImages(guantesTermicosImages);
        botasSnowboard.setImages(botasSnowboardImages);

        // Agregar reseñas a los productos
        Review review1 = new Review(5.0,"Excelente tabla", cosmicx, clientService.findById(1L));
        Review review2 = new Review(4.0,"Muy cara", divinium, clientService.findById(2L));
        Review review3 = new Review(5.0,"Me gusta mucho el diseño", vanillaluv, clientService.findById(2L));
        Review review4 = new Review(5.0,"Me encantó", kaizen, clientService.findById(2L));
        Review review5 = new Review(5.0,"Excelentes esquís", cosmicy, clientService.findById(1L));
        Review review6 = new Review(4.0,"Muy caros", flame, clientService.findById(2L));
        Review review7 = new Review(5.0,"Me gusta mucho el diseño", vanilladisluv, clientService.findById(2L));
        Review review8 = new Review(5.0,"Me encantaron", mikuseina, clientService.findById(2L));

        // Reseñas para accesorios
        Review review9 = new Review(4.5,"Excelente calidad y muy cómodas", gafasSnow, clientService.findById(1L));
        Review review10 = new Review(5.0,"Muy buenos guantes, mantienen el calor perfecto", guantesTermicos, clientService.findById(2L));
        Review review11 = new Review(4.0,"Botas resistentes y cómodas", botasSnowboard, clientService.findById(1L));

        cosmicx.setReview(List.of(review1));
        divinium.setReview(List.of(review2));
        vanillaluv.setReview(List.of(review3));
        kaizen.setReview(List.of(review4));
        cosmicy.setReview(List.of(review5));
        flame.setReview(List.of(review6));
        vanilladisluv.setReview(List.of(review7));
        mikuseina.setReview(List.of(review8));
        gafasSnow.setReview(List.of(review9));
        guantesTermicos.setReview(List.of(review10));
        botasSnowboard.setReview(List.of(review11));

        // Guardar productos
        productService.save(cosmicx);
        productService.save(divinium);
        productService.save(vanillaluv);
        productService.save(kaizen);
        productService.save(cosmicy);
        productService.save(flame);
        productService.save(vanilladisluv);
        productService.save(mikuseina);
        productService.save(gafasSnow);
        productService.save(guantesTermicos);
        productService.save(botasSnowboard);
    }

    private void initOrders(OrderService orderService, ClientService clientService, ProductService productService) {
        // Crear un pedido con sus detalles
        Order order = new Order(LocalDate.now(), OrderStatus.PENDING, "nombre de la calle", "Número de la calle", "ANOTACIONES", clientService.findById(2L));

        // Crear detalles del pedido
        OrderDetails od1 = new OrderDetails(null, productService.findById(2L), 2, null);
        OrderDetails od2 = new OrderDetails(null, productService.findById(1L), 10, null);

        // Añadir los detalles al pedido
        List<OrderDetails> orderDetailsList = List.of(od1, od2);

        // Guardar el pedido con sus detalles utilizando el servicio
        orderService.createOrderWithDetails(order, orderDetailsList);
    }

    private void initUsers(UserService userService, RoleRepo roleRepo) {
        User admin = new User("admin", "admin@gmail.com","adminadmin");
        admin.setRoles(Set.of(roleRepo.findById(1L).orElseThrow(() -> new RuntimeException("Role not found"))));
        userService.save(admin);
    }
}