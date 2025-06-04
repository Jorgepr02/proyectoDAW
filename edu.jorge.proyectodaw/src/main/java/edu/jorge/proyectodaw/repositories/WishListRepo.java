package edu.jorge.proyectodaw.repositories;

import edu.jorge.proyectodaw.entity.WishList;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WishListRepo extends JpaRepository<WishList, Long> {

    Optional<WishList> findByUser_IdAndProducts_Id(Long userId, Long productId);
}
