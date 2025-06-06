package edu.jorge.proyectodaw.service;

import edu.jorge.proyectodaw.entity.Client;

import java.util.List;

public interface ClientService {
    List<Client> findAll();
    Client findById(Long id);
    Client save(Client client);
    Client create(Client client);
    Client update(Long id, Client client);
    void delete(Long id);

    Client findByUserId(Long userId);
}