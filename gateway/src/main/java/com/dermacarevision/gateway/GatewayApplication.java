package com.dermacarevision.gateway;

import com.dermacarevision.gateway.config.AppProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

/**
 * DermacareVision AI - API Gateway.
 * Developed by Ibrahim Shaikh, Sahil Sahare, Tohid Pathan.
 *
 * Fronts the React client: handles authentication, persistence, analytics,
 * and proxies machine-learning work to the Python inference service.
 */
@SpringBootApplication
@EnableConfigurationProperties(AppProperties.class)
public class GatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(GatewayApplication.class, args);
    }
}
