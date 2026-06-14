package com.dermacarevision.gateway.prediction;

import com.dermacarevision.gateway.config.AppProperties;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/** Thin client over the Python inference microservice. */
@Service
public class InferenceClient {

    private final RestTemplate rest;
    private final ObjectMapper mapper;
    private final String baseUrl;

    public InferenceClient(RestTemplate rest, ObjectMapper mapper, AppProperties props) {
        this.rest = rest;
        this.mapper = mapper;
        this.baseUrl = props.getInferenceUrl();
    }

    public JsonNode predict(byte[] image, String filename, int modelId) {
        return postMultipart("/api/predict", image, filename, modelId);
    }

    public JsonNode gradcam(byte[] image, String filename, int modelId) {
        return postMultipart("/api/gradcam", image, filename, modelId);
    }

    public JsonNode getModels() {
        return getJson("/api/models");
    }

    public JsonNode insight(String label) {
        return getJson("/api/insights?label=" + uriEncode(label));
    }

    public JsonNode health() {
        return getJson("/api/health");
    }

    // ------------------------------------------------------------------ //
    private JsonNode postMultipart(String path, byte[] image, String filename, int modelId) {
        ByteArrayResource resource = new ByteArrayResource(image) {
            @Override
            public String getFilename() {
                return filename == null ? "upload.png" : filename;
            }
        };
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);
        body.add("model_id", String.valueOf(modelId));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> entity = new HttpEntity<>(body, headers);

        ResponseEntity<String> resp = rest.postForEntity(baseUrl + path, entity, String.class);
        return parse(resp.getBody());
    }

    private JsonNode getJson(String path) {
        ResponseEntity<String> resp = rest.getForEntity(baseUrl + path, String.class);
        return parse(resp.getBody());
    }

    private JsonNode parse(String body) {
        try {
            return mapper.readTree(body == null ? "{}" : body);
        } catch (Exception e) {
            throw new RuntimeException("Invalid inference service response", e);
        }
    }

    private String uriEncode(String s) {
        return java.net.URLEncoder.encode(s == null ? "" : s, java.nio.charset.StandardCharsets.UTF_8);
    }
}
