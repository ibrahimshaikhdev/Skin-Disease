package com.dermacarevision.gateway.auth;

/** Request/response payloads for authentication endpoints. */
public class AuthDtos {

    public record RegisterRequest(String username, String password) {}

    public record LoginRequest(String username, String password) {}

    public record AuthResponse(String token, String username) {}
}
