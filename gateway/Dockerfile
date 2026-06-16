# DermacareVision AI - API Gateway (Render / Docker)
# Developed by Ibrahim Shaikh, Sahil Sahare, Tohid Pathan

# ---- Build stage: compile the jar with Maven + JDK 17 ----
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /build
COPY pom.xml .
# Cache dependencies first for faster rebuilds
RUN mvn -q dependency:go-offline
COPY src ./src
RUN mvn -q -DskipTests clean package

# ---- Run stage: slim JRE with just the jar ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /build/target/gateway-1.0.0.jar app.jar

# Render injects PORT; Spring Boot must bind to it. Default to prod profile.
ENV SPRING_PROFILES_ACTIVE=prod
EXPOSE 8080

# Bind Spring's server.port to Render's $PORT at runtime.
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
