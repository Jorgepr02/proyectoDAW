package edu.jorge.proyectodaw.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

    private ClientSimpleOutputDTO convertToDTO(Client client) {
        ClientSimpleOutputDTO dto = new ClientSimpleOutputDTO();
        dto.setId(client.getId());
        dto.setName(client.getName());
        dto.setEmail(client.getEmail());
        dto.setPhone(client.getPhone());
        dto.setTypeAddr(client.getTypeAddr() != null ? client.getTypeAddr().name() : null);
        dto.setNameAddr(client.getNameAddr());
        dto.setNumberAddr(client.getNumberAddr());
        dto.setRegistrationDate(client.getRegistrationDate());
        return dto;
    }
}
