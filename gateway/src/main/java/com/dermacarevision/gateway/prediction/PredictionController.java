package com.dermacarevision.gateway.prediction;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/** Prediction, history, detail, image, and heatmap endpoints. */
@RestController
@RequestMapping("/api")
public class PredictionController {

    private final InferenceClient inference;
    private final PredictionRepository repository;
    private final FileStorageService storage;
    private final ObjectMapper mapper;

    public PredictionController(InferenceClient inference, PredictionRepository repository,
                               FileStorageService storage, ObjectMapper mapper) {
        this.inference = inference;
        this.repository = repository;
        this.storage = storage;
        this.mapper = mapper;
    }

    /** Run analysis, persist the result, and return the enriched response. */
    @PostMapping("/predict")
    public ResponseEntity<?> predict(@RequestParam("file") MultipartFile file,
                                     @RequestParam("model_id") int modelId,
                                     Authentication auth) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));
        }
        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Could not read upload"));
        }

        JsonNode result = inference.predict(bytes, file.getOriginalFilename(), modelId);
        JsonNode predictionNode = result.path("prediction");

        String username = auth != null ? auth.getName() : "guest";
        String filename = storage.store(bytes, file.getOriginalFilename());

        Prediction entity = new Prediction();
        entity.setUsername(username);
        entity.setModelId(result.path("model_id").asInt(modelId));
        entity.setModelName(result.path("model_name").asText("Model " + modelId));
        entity.setLabel(predictionNode.path("label").asText("Unknown"));
        entity.setConfidence(predictionNode.path("confidence").asDouble(0));
        entity.setProbabilitiesJson(predictionNode.path("probabilities").toString());
        entity.setMode(result.path("mode").asText("mock"));
        entity.setImageFilename(filename);
        entity.setCreatedAt(Instant.now());
        repository.save(entity);

        ObjectNode response = (ObjectNode) result;
        response.put("id", entity.getId());
        response.put("username", username);
        response.put("imageUrl", "/api/images/" + filename);
        return ResponseEntity.ok(response);
    }

    /** Current user's analysis history (most recent first). */
    @GetMapping("/predictions")
    public ResponseEntity<?> history(Authentication auth) {
        String username = auth.getName();
        List<Map<String, Object>> items = new ArrayList<>();
        for (Prediction p : repository.findByUsernameOrderByCreatedAtDesc(username)) {
            items.add(summary(p));
        }
        return ResponseEntity.ok(Map.of("predictions", items));
    }

    /** Detailed view of a single prediction (owner only). */
    @GetMapping("/predictions/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id, Authentication auth) {
        var opt = repository.findById(id);
        if (opt.isEmpty() || !opt.get().getUsername().equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Prediction not found"));
        }
        Prediction p = opt.get();
        Map<String, Object> detail = summary(p);
        detail.put("probabilities", parseProbabilities(p));
        try {
            detail.put("insight", inference.insight(p.getLabel()).path("insight"));
        } catch (Exception ignored) {
            // insight is best-effort
        }
        return ResponseEntity.ok(detail);
    }

    /** Generate a Grad-CAM heatmap for a stored prediction's image. */
    @GetMapping("/predictions/{id}/heatmap")
    public ResponseEntity<?> heatmap(@PathVariable Long id) {
        var opt = repository.findById(id);
        if (opt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Prediction not found"));
        }
        Prediction p = opt.get();
        if (p.getImageFilename() == null || !storage.exists(p.getImageFilename())) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "No stored image for this prediction"));
        }
        byte[] bytes = storage.read(p.getImageFilename());
        JsonNode cam = inference.gradcam(bytes, p.getImageFilename(), p.getModelId());
        return ResponseEntity.ok(cam);
    }

    /** Serve a stored lesion image by its opaque filename. */
    @GetMapping("/images/{filename}")
    public ResponseEntity<byte[]> image(@PathVariable String filename) {
        if (!storage.exists(filename)) {
            return ResponseEntity.notFound().build();
        }
        byte[] bytes = storage.read(filename);
        MediaType type = MediaTypeFactory.fromFilename(filename);
        return ResponseEntity.ok()
                .contentType(type)
                .cacheControl(org.springframework.http.CacheControl.maxAge(java.time.Duration.ofHours(1)))
                .body(bytes);
    }

    // ------------------------------------------------------------------ //
    private Map<String, Object> summary(Prediction p) {
        Map<String, Object> m = new java.util.LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("modelId", p.getModelId());
        m.put("modelName", p.getModelName());
        m.put("label", p.getLabel());
        m.put("confidence", p.getConfidence());
        m.put("mode", p.getMode());
        m.put("createdAt", p.getCreatedAt().toString());
        m.put("imageUrl", p.getImageFilename() != null ? "/api/images/" + p.getImageFilename() : null);
        return m;
    }

    private JsonNode parseProbabilities(Prediction p) {
        try {
            return mapper.readTree(p.getProbabilitiesJson() == null ? "[]" : p.getProbabilitiesJson());
        } catch (Exception e) {
            return mapper.createArrayNode();
        }
    }

    /** Minimal extension -> content type mapping for stored images. */
    static class MediaTypeFactory {
        static MediaType fromFilename(String filename) {
            String f = filename.toLowerCase();
            if (f.endsWith(".png")) return MediaType.IMAGE_PNG;
            if (f.endsWith(".jpg") || f.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
            if (f.endsWith(".gif")) return MediaType.IMAGE_GIF;
            if (f.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
            if (f.endsWith(".bmp")) return MediaType.parseMediaType("image/bmp");
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
