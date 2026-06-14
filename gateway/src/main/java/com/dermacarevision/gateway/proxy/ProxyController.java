package com.dermacarevision.gateway.proxy;

import com.dermacarevision.gateway.prediction.InferenceClient;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** Public pass-through endpoints to the inference service. */
@RestController
@RequestMapping("/api")
public class ProxyController {

    private final InferenceClient inference;

    public ProxyController(InferenceClient inference) {
        this.inference = inference;
    }

    @GetMapping("/models")
    public ResponseEntity<?> models() {
        return ResponseEntity.ok(inference.getModels());
    }

    @GetMapping("/insights")
    public ResponseEntity<?> insights(@RequestParam("label") String label) {
        return ResponseEntity.ok(inference.insight(label));
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        JsonNode downstream;
        try {
            downstream = inference.health();
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                    "gateway", "healthy",
                    "inference", "unreachable",
                    "error", e.getMessage()));
        }
        return ResponseEntity.ok(Map.of(
                "gateway", "healthy",
                "inference", downstream));
    }
}
