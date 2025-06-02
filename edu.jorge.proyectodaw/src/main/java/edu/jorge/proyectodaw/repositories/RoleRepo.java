package edu.jorge.proyectodaw.repositories;

import edu.jorge.proyectodaw.entity.Role;
import edu.jorge.proyectodaw.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);
}
