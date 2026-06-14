package com.dermacarevision.gateway.prediction;

import jakarta.persistence.*;

import java.time.Instant;

/** A persisted analysis result tied to a user (or "guest"). */
@Entity
@Table(name = "predictions")
public class Prediction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private int modelId;

    @Column(nullable = false)
    private String modelName;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private double confidence;

    /** Full probability distribution serialized as JSON. */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String probabilitiesJson;

    /** "torch" or "mock", recorded for transparency. */
    @Column(nullable = false)
    private String mode = "mock";

    /** Stored image file name (UUID + extension), or null if not stored. */
    private String imageFilename;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public int getModelId() { return modelId; }
    public void setModelId(int modelId) { this.modelId = modelId; }
    public String getModelName() { return modelName; }
    public void setModelName(String modelName) { this.modelName = modelName; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
    public String getProbabilitiesJson() { return probabilitiesJson; }
    public void setProbabilitiesJson(String probabilitiesJson) { this.probabilitiesJson = probabilitiesJson; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getImageFilename() { return imageFilename; }
    public void setImageFilename(String imageFilename) { this.imageFilename = imageFilename; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
