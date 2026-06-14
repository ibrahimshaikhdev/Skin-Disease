package com.dermacarevision.gateway.dashboard;

import com.dermacarevision.gateway.prediction.Prediction;
import com.dermacarevision.gateway.prediction.PredictionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.temporal.ChronoUnit;
import java.util.*;

/** Aggregated analytics for the signed-in user's dashboard. */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final PredictionRepository repository;

    public DashboardController(PredictionRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats(Authentication auth) {
        String username = auth.getName();
        List<Prediction> all = repository.findByUsernameOrderByCreatedAtDesc(username);

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("username", username);
        out.put("totalPredictions", all.size());

        // Average confidence
        double avg = all.stream().mapToDouble(Prediction::getConfidence).average().orElse(0);
        out.put("averageConfidence", round(avg));

        // High-confidence (>= 0.8) count
        long highConf = all.stream().filter(p -> p.getConfidence() >= 0.8).count();
        out.put("highConfidenceCount", highConf);

        // Distinct conditions detected
        out.put("distinctConditions", all.stream().map(Prediction::getLabel).distinct().count());

        // Per-model usage
        Map<String, Integer> byModel = new LinkedHashMap<>();
        for (Prediction p : all) {
            byModel.merge(p.getModelName(), 1, Integer::sum);
        }
        out.put("byModel", toCountList(byModel));

        // Top conditions (label distribution)
        Map<String, Integer> byLabel = new LinkedHashMap<>();
        for (Prediction p : all) {
            byLabel.merge(p.getLabel(), 1, Integer::sum);
        }
        List<Map<String, Object>> topConditions = toCountList(byLabel);
        topConditions.sort((a, b) -> Integer.compare((int) b.get("count"), (int) a.get("count")));
        out.put("topConditions", topConditions.stream().limit(8).toList());

        // 7-day trend (oldest -> newest)
        out.put("trend", buildTrend(all, 7));

        // Recent activity (latest 5 summaries)
        List<Map<String, Object>> recent = new ArrayList<>();
        for (Prediction p : all.stream().limit(5).toList()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId());
            m.put("modelName", p.getModelName());
            m.put("label", p.getLabel());
            m.put("confidence", round(p.getConfidence()));
            m.put("createdAt", p.getCreatedAt().toString());
            m.put("imageUrl", p.getImageFilename() != null ? "/api/images/" + p.getImageFilename() : null);
            recent.add(m);
        }
        out.put("recent", recent);

        return ResponseEntity.ok(out);
    }

    private List<Map<String, Object>> buildTrend(List<Prediction> all, int days) {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
        Map<LocalDate, Integer> counts = new HashMap<>();
        for (Prediction p : all) {
            LocalDate d = LocalDate.ofInstant(p.getCreatedAt(), ZoneOffset.UTC);
            counts.merge(d, 1, Integer::sum);
        }
        List<Map<String, Object>> trend = new ArrayList<>();
        for (int i = days - 1; i >= 0; i--) {
            LocalDate day = today.minus(i, ChronoUnit.DAYS);
            Map<String, Object> point = new LinkedHashMap<>();
            point.put("date", day.toString());
            point.put("count", counts.getOrDefault(day, 0));
            trend.add(point);
        }
        return trend;
    }

    private List<Map<String, Object>> toCountList(Map<String, Integer> map) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (Map.Entry<String, Integer> e : map.entrySet()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("name", e.getKey());
            m.put("count", e.getValue());
            list.add(m);
        }
        return list;
    }

    private double round(double v) {
        return Math.round(v * 10000.0) / 10000.0;
    }
}
