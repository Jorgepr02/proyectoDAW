package edu.jorge.proyectodaw.service;

import edu.jorge.proyectodaw.entity.Feature;

import java.util.List;

public interface FeatureService {
    List<Feature> findAll();
    Feature findById(Long id);
}
