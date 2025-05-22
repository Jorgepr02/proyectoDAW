package edu.jorge.proyectodaw.repositories;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Category;

@Repository
public interface CategoryRepo extends JpaRepository<Category, Long> {

}
