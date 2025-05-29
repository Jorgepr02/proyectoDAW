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
    }
}
