package edu.jorge.proyectodaw.service.impl;

import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.repositories.FeatureRepo;
import edu.jorge.proyectodaw.service.FeatureService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeatureServiceImp implements FeatureService {

    @Autowired
    private FeatureRepo featureRepo;

    @Override
    public List<Feature> findAll() {
        return featureRepo.findAll();
    }

    @Override
    public Feature findById(Long id) {
        return featureRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Característica no encontrada con id: " + id));
    }
}