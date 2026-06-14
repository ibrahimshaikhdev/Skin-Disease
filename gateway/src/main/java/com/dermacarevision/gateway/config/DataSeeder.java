package com.dermacarevision.gateway.config;

import com.dermacarevision.gateway.prediction.Prediction;
import com.dermacarevision.gateway.prediction.PredictionRepository;
import com.dermacarevision.gateway.user.User;
import com.dermacarevision.gateway.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;

/**
 * Seeds a demo account and sample history so the dashboard and history views
 * are populated on first run. Disabled outside the dev profile.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private final AppProperties props;
    private final UserRepository users;
    private final PredictionRepository predictions;
    private final PasswordEncoder encoder;

    public DataSeeder(AppProperties props, UserRepository users,
                      PredictionRepository predictions, PasswordEncoder encoder) {
        this.props = props;
        this.users = users;
        this.predictions = predictions;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) {
        if (!props.isSeedDemo() || users.existsByUsername("demo")) {
            return;
        }

        users.save(new User("demo", encoder.encode("demo12345")));

        // Representative sample analyses spread across the past week.
        String[][] samples = {
                // modelId, modelName, label, mode
                {"1", "Model 1 - Quick Screening", "Acne", "mock"},
                {"1", "Model 1 - Quick Screening", "Normal", "mock"},
                {"1", "Model 1 - Quick Screening", "Nail Fungus", "mock"},
                {"2", "Model 2 - Standard Analysis", "Melanoma", "mock"},
                {"2", "Model 2 - Standard Analysis", "Atopic Dermatitis", "mock"},
                {"2", "Model 2 - Standard Analysis", "Melanocytic Nevi (NV)", "mock"},
                {"3", "Model 3 - Comprehensive Screening", "Eczema", "mock"},
                {"3", "Model 3 - Comprehensive Screening", "Psoriasis Lichen Planus and related diseases", "mock"},
                {"1", "Model 1 - Quick Screening", "Acne", "mock"},
                {"2", "Model 2 - Standard Analysis", "Melanoma", "mock"},
                {"3", "Model 3 - Comprehensive Screening", "Acne and Rosacea", "mock"},
                {"1", "Model 1 - Quick Screening", "Skin Allergy", "mock"},
                {"2", "Model 2 - Standard Analysis", "Basal Cell Carcinoma (BCC)", "mock"},
                {"3", "Model 3 - Comprehensive Screening", "Tinea Ringworm Candidiasis and other Fungal Infections", "mock"},
                {"1", "Model 1 - Quick Screening", "Normal", "mock"},
                {"2", "Model 2 - Standard Analysis", "Atopic Dermatitis", "mock"},
        };

        Random rng = new Random(42);
        Instant now = Instant.now();
        for (int i = 0; i < samples.length; i++) {
            String[] s = samples[i];
            Prediction p = new Prediction();
            p.setUsername("demo");
            p.setModelId(Integer.parseInt(s[0]));
            p.setModelName(s[1]);
            p.setLabel(s[2]);
            double conf = 0.55 + rng.nextDouble() * 0.44; // 0.55 - 0.99
            p.setConfidence(Math.round(conf * 10000.0) / 10000.0);
            p.setProbabilitiesJson("[{\"class\":\"" + s[2] + "\",\"probability\":"
                    + (Math.round(conf * 10000.0) / 10000.0) + "}]");
            p.setMode(s[3]);
            p.setImageFilename(null);
            // Spread across the last 7 days, varied times.
            long daysAgo = i % 7;
            long hoursJitter = rng.nextInt(24);
            p.setCreatedAt(now.minus(daysAgo, ChronoUnit.DAYS).minus(hoursJitter, ChronoUnit.HOURS));
            predictions.save(p);
        }

        System.out.println("[DataSeeder] Seeded demo user (demo / demo12345) with "
                + samples.length + " sample predictions.");
    }
}
