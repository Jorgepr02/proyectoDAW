package edu.jorge.proyectodaw.service.impl;

import edu.jorge.proyectodaw.entity.User;
import edu.jorge.proyectodaw.repositories.UserRepo;
import edu.jorge.proyectodaw.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImp implements UserService {
    
    @Autowired
    private UserRepo userRepo;

    @Override
    public List<User> findAll() {
        return userRepo.findAll();
    }

    @Override
    public User findById(Long id) {
        return userRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado con id: " + id));
    }

    @Override
    public User save(User user) {
        return userRepo.save(user);
    }

    @Override
    public User update(Long id, User user) {
        User existingUser = findById(id);
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
//        existingUser.setRole(user.getRole());
        return userRepo.save(existingUser);
    }

    @Override
    public void delete(Long id) {
        User user = findById(id);
        userRepo.delete(user);
    }
}
