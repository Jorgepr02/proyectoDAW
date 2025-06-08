package edu.jorge.proyectodaw.service;

import edu.jorge.proyectodaw.entity.User;

import java.util.List;

public interface UserService {
    List<User> findAll();
    User findById(Long id);
    User save(User user);
    User create(User user);
    User update(Long id, User user);
    void delete(Long id);
}
