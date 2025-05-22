package edu.jorge.proyectodaw.service;

import org.springframework.beans.factory.annotation.Autowired;

import edu.jorge.proyectodaw.repositories.UserRepo;

public class ProductServiceImp implements ProductService {

    @Autowired
    private UserRepo userRepo;

}
