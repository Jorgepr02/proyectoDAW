package edu.jorge.proyectodaw.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.repositories.FeatureRepo;
import jakarta.persistence.EntityNotFoundException;

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

    @Override
    public Feature save(Feature feature) {
        return featureRepo.save(feature);
    }

    @Override
    public Feature update(Long id, Feature feature) {
        Feature existingFeature = findById(id);
        existingFeature.setName(feature.getName());
        return featureRepo.save(existingFeature);
    }

    @Override
    public void delete(Long id) {
        Feature feature = findById(id);
        featureRepo.delete(feature);
    }
}