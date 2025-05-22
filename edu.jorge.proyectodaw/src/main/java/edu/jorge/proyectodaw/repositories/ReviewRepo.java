package edu.jorge.proyectodaw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Review;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
}
