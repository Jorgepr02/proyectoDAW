package edu.jorge.proyectodaw;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import edu.jorge.proyectodaw.entity.Category;
import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.enums.CategoryType;
import edu.jorge.proyectodaw.repositories.CategoryRepo;
import edu.jorge.proyectodaw.repositories.FeatureRepo;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		ConfigurableApplicationContext context = SpringApplication.run(Application.class, args);
		
        // Repositorio de Categoría
        CategoryRepo categoryRepo = context.getBean(CategoryRepo.class);
        // Repositorio de Características
        FeatureRepo featureRepo = context.getBean(FeatureRepo.class);

        // Inicializamos los datos
        initFeatureData(featureRepo);
        initData(categoryRepo, featureRepo);
        
        System.out.println("Base de datos inicializada correctamente");
	}

    public static void initData(CategoryRepo categoryRepo, FeatureRepo featureRepo) {
        Category category1 = new Category();
        category1.setName("Informática");
        category1.setDescription("Productos relacionados con la informática");
        category1.setCategoryType(CategoryType.SNOWBOARD);
        categoryRepo.save(category1);
        
        Category category2 = new Category();
        category2.setName("Electrodomésticos");
        category2.setDescription("Productos para el hogar");
        category2.setCategoryType(CategoryType.SKI);
        categoryRepo.save(category2);
        
        Category category3 = new Category();
        category3.setName("Telefonía");
        category3.setDescription("Móviles y accesorios");
        categoryRepo.save(category3);
    }

    public static void initFeatureData(FeatureRepo featureRepo) {
        Feature featureCreated1 = featureRepo.save(
            new Feature(
                null, 
                "Polivalencia"
            )
        );
        Feature featureCreated2 = featureRepo.save(
            new Feature(
                null, 
                "Agarre"
            )
        );
        Feature featureCreated3 = featureRepo.save(
            new Feature(
                null, 
                "Rigidez"
            )
        );
        Feature featureCreated4 = featureRepo.save(
            new Feature(
                null, 
                "Estabilidad"
            )
        );
    }
}
