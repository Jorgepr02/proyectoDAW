package edu.jorge.proyectodaw.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.repositories.ClientRepo;
import jakarta.persistence.EntityNotFoundException;

@Service
public class ClientServiceImp implements ClientService {

    @Autowired
    private ClientRepo clientRepo;

    @Override
    public List<Client> findAll() {
        return clientRepo.findAll();
    }

    @Override
    public Client findById(Long id) {
        return clientRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Client not found with id: " + id));
    }

    @Override
    public Client save(Client client) {
        return clientRepo.save(client);
    }

    @Override
    public Client update(Long id, Client client) {
        Client existingClient = findById(id);
        existingClient.setName(client.getName());
        existingClient.setEmail(client.getEmail());
        existingClient.setPhone(client.getPhone());
        existingClient.setPhoto(client.getPhoto());
        existingClient.setTypeAddr(client.getTypeAddr());
        existingClient.setNameAddr(client.getNameAddr());
        existingClient.setNumberAddr(client.getNumberAddr());
        existingClient.setRegistrationDate(client.getRegistrationDate());
        return clientRepo.save(existingClient);
    }

    @Override
    public void delete(Long id) {
        Client client = findById(id);
        clientRepo.delete(client);
    }
}
