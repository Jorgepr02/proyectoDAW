package edu.jorge.proyectodaw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.enums.CategoryType;
import edu.jorge.proyectodaw.repositories.CategoryRepo;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
		CategoryRepo categoryRepo = context.getBean(CategoryRepo.class);
            Category category1 = new Category();
            category1.setName("Informática");
            category1.setDescription("Productos relacionados con la informática");
			category1.setCategoryType(CategoryType.SNOWBOARD);
            categoryRepo.save(category1);
            
            Category category2 = new Category();
            category2.setName("Electrodomésticos");
            category2.setDescription("Productos para el hogar");
			category2.setCategoryType(CategoryType.SNOWBOARD);
            categoryRepo.save(category2);
            
            Category category3 = new Category();
            category3.setName("Telefonía");
            category3.setDescription("Móviles y accesorios");
            categoryRepo.save(category3);
            
            System.out.println("Base de datos inicializada correctamente");
	}

}
