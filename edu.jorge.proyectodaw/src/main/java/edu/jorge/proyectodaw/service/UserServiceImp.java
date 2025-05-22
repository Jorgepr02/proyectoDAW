package edu.jorge.proyectodaw.service;

import org.springframework.beans.factory.annotation.Autowired;

import edu.jorge.proyectodaw.repositories.UserRepo;

public class UserServiceImp implements UserService {
    
    @Autowired
    private UserRepo userRepo;

}
