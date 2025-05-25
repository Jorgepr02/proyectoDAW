package edu.jorge.proyectodaw.service;

import java.util.List;
import edu.jorge.proyectodaw.entity.Client;

public interface ClientService {
    List<Client> findAll();
    Client findById(Long id);
    Client save(Client client);
    Client update(Long id, Client client);
    void delete(Long id);
}