package com.dermacarevision.gateway.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Strongly-typed configuration bound from the {@code dermacare.*} namespace.
 */
@ConfigurationProperties(prefix = "dermacare")
public class AppProperties {

    /** Base URL of the Python inference microservice. */
    private String inferenceUrl = "http://localhost:5001";

    /** Directory where uploaded lesion images are stored. */
    private String uploadsDir = "uploads";

    /** Allowed CORS origins for the browser client. */
    private String corsOrigins = "http://localhost:5173";

    /** Seed a demo user and sample predictions on startup (dev only). */
    private boolean seedDemo = true;

    private final Jwt jwt = new Jwt();

    public static class Jwt {
        /** HMAC signing secret (must be >= 256 bits). */
        private String secret = "dev-secret-change-me-0123456789abcdef0123456789abcdef0123456789";
        /** Token lifetime in milliseconds. */
        private long expirationMs = 86_400_000L; // 24h

        public String getSecret() { return secret; }
        public void setSecret(String secret) { this.secret = secret; }
        public long getExpirationMs() { return expirationMs; }
        public void setExpirationMs(long expirationMs) { this.expirationMs = expirationMs; }
    }

    public String getInferenceUrl() { return inferenceUrl; }
    public void setInferenceUrl(String inferenceUrl) { this.inferenceUrl = inferenceUrl; }
    public String getUploadsDir() { return uploadsDir; }
    public void setUploadsDir(String uploadsDir) { this.uploadsDir = uploadsDir; }
    public String getCorsOrigins() { return corsOrigins; }
    public void setCorsOrigins(String corsOrigins) { this.corsOrigins = corsOrigins; }
    public boolean isSeedDemo() { return seedDemo; }
    public void setSeedDemo(boolean seedDemo) { this.seedDemo = seedDemo; }
    public Jwt getJwt() { return jwt; }
}
