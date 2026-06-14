package com.dermacarevision.gateway.auth;

import com.dermacarevision.gateway.security.JwtService;
import com.dermacarevision.gateway.user.User;
import com.dermacarevision.gateway.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/** Registration, login, and current-user endpoints. */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthDtos.RegisterRequest req) {
        if (req.username() == null || req.username().isBlank()
                || req.password() == null || req.password().length() < 6) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Username required and password must be at least 6 characters"));
        }
        String username = req.username().trim();
        if (users.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Username already taken"));
        }
        User user = new User(username, encoder.encode(req.password()));
        users.save(user);
        String token = jwtService.generateToken(username);
        return ResponseEntity.ok(new AuthDtos.AuthResponse(token, username));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDtos.LoginRequest req) {
        var user = users.findByUsername(req.username() == null ? "" : req.username().trim());
        if (user.isEmpty() || !encoder.matches(req.password(), user.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid username or password"));
        }
        String token = jwtService.generateToken(user.get().getUsername());
        return ResponseEntity.ok(new AuthDtos.AuthResponse(token, user.get().getUsername()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(Map.of("username", authentication.getName()));
    }
}
