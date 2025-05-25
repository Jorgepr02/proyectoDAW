package edu.jorge.proyectodaw.service;

import java.util.List;
import edu.jorge.proyectodaw.entity.Feature;

public interface FeatureService {
    List<Feature> findAll();
    Feature findById(Long id);
    Feature save(Feature feature);
    Feature update(Long id, Feature feature);
    void delete(Long id);
}
