package edu.jorge.proyectodaw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import edu.jorge.proyectodaw.repositories.CategoryRepo;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
		CategoryRepo categoryRepo = context.getBean(CategoryRepo.class);
	}

}
