package edu.jorge.proyectodaw.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.jorge.proyectodaw.controller.dto.input.ClientInputDTO;
import edu.jorge.proyectodaw.controller.dto.output.ClientSimpleOutputDTO;
import edu.jorge.proyectodaw.entity.Client;
import edu.jorge.proyectodaw.service.ClientService;

@RestController
@RequestMapping("/api/clients")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @GetMapping
    public ResponseEntity<List<ClientSimpleOutputDTO>> findAll() {
        List<Client> clients = clientService.findAll();
        List<ClientSimpleOutputDTO> clientDTOs = clients.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(clientDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClientSimpleOutputDTO> findById(@PathVariable Long id) {
        Client client = clientService.findById(id);
        ClientSimpleOutputDTO clientDTO = convertToDTO(client);
        return ResponseEntity.ok(clientDTO);
    }

    @PostMapping
    public ResponseEntity<ClientSimpleOutputDTO> createClient(@RequestBody ClientInputDTO clientDTO) {
        Client client = convertToEntity(clientDTO);
        Client createdClient = clientService.save(client);
        ClientSimpleOutputDTO responseDTO = convertToDTO(createdClient);
        return new ResponseEntity<>(responseDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClientSimpleOutputDTO> updateClient(@PathVariable Long id, @RequestBody ClientInputDTO clientDTO) {
        Client client = convertToEntity(clientDTO);
        Client updatedClient = clientService.update(id, client);
        ClientSimpleOutputDTO responseDTO = convertToDTO(updatedClient);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClient(@PathVariable Long id) {
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Client convertToEntity(ClientInputDTO clientDTO) {
        Client client = new Client();
        client.setName(clientDTO.getName());
        client.setEmail(clientDTO.getEmail());
        client.setPhone(clientDTO.getPhone());
        client.setNameAddr(clientDTO.getNameAddr());
        client.setNumberAddr(clientDTO.getNumberAddr());
        client.setRegistrationDate(clientDTO.getRegistrationDate());
        return client;
    }

    private ClientSimpleOutputDTO convertToDTO(Client client) {
        ClientSimpleOutputDTO dto = new ClientSimpleOutputDTO();
        dto.setId(client.getId());
        dto.setName(client.getName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setNameAddr(client.getNameAddr());
        dto.setNumberAddr(client.getNumberAddr());
        dto.setRegistrationDate(client.getRegistrationDate());
        return dto;
    }
}
