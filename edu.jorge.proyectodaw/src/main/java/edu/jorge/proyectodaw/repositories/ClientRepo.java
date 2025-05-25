package edu.jorge.proyectodaw.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import edu.jorge.proyectodaw.entity.Client;

@Repository
public interface ClientRepo extends JpaRepository<Client, Long> {

}
