package edu.jorge.proyectodaw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Order;

@Repository
public interface OrderRepo extends JpaRepository<Order, Long> {

//    List<Order> findByUserId(Long userId); // TODO
}
