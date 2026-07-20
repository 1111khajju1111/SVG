package com.thevault.backend.controller;

import com.thevault.backend.dto.AuthResponse;
import com.thevault.backend.dto.LoginRequest;
import com.thevault.backend.dto.SignupRequest;
import com.thevault.backend.dto.UserResponse;
import com.thevault.backend.security.AuthGuard;
import com.thevault.backend.service.AuthService;
import com.thevault.backend.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request,
                                                HttpServletRequest httpRequest) {
        String ip = RequestUtils.getClientIp(httpRequest);
        return ResponseEntity.ok(authService.signup(request, ip));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request,
                                               HttpServletRequest httpRequest) {
        String ip = RequestUtils.getClientIp(httpRequest);
        return ResponseEntity.ok(authService.login(request, ip));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        Long userId = AuthGuard.requireAuth().getId();
        return ResponseEntity.ok(authService.getById(userId));
    }
}
