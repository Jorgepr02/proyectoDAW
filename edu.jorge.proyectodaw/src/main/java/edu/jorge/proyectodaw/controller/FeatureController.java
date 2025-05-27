package edu.jorge.proyectodaw.controller;

import edu.jorge.proyectodaw.entity.Feature;
import edu.jorge.proyectodaw.service.FeatureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import jakarta.persistence.EntityNotFoundException;


import java.util.List;

@RestController
@RequestMapping("/api/features")
public class FeatureController {

    @Autowired
    private FeatureService featureService;

    @GetMapping
    public ResponseEntity<List<Feature>> getAllFeatures() {
        List<Feature> features = featureService.findAll();
        return ResponseEntity.ok(features);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Feature> getFeatureById(@PathVariable Long id) {
        try {
            Feature feature = featureService.findById(id);
            return ResponseEntity.ok(feature);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
}