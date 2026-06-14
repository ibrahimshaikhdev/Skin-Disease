package com.dermacarevision.gateway.prediction;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {
    List<Prediction> findByUsernameOrderByCreatedAtDesc(String username);
    long countByUsername(String username);
}
