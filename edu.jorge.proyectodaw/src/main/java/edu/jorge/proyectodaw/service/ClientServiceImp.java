package edu.jorge.proyectodaw.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.jorge.proyectodaw.repositories.UserRepo;

@Service
public class ClientServiceImp implements ClientService {

    @Autowired
    private UserRepo userRepo;

}
