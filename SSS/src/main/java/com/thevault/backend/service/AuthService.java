package com.thevault.backend.service;

import com.thevault.backend.dto.AuthResponse;
import com.thevault.backend.dto.LoginRequest;
import com.thevault.backend.dto.SignupRequest;
import com.thevault.backend.dto.UserResponse;
import com.thevault.backend.exception.ApiException;
import com.thevault.backend.model.Role;
import com.thevault.backend.model.User;
import com.thevault.backend.repository.UserRepository;
import com.thevault.backend.security.AttemptRateLimiter;
import com.thevault.backend.security.JwtUtil;
import com.thevault.backend.security.PasswordUtil;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    // Login: locked out after 5 wrong attempts, either against one account
    // or from one IP, for 15 minutes.
    private static final int LOGIN_MAX_ATTEMPTS = 5;
    private static final long LOGIN_WINDOW_MS = 15 * 60 * 1000L;

    // Signup: looser limit, just to stop automated account-creation spam —
    // 10 signups per hour from one IP.
    private static final int SIGNUP_MAX_ATTEMPTS = 10;
    private static final long SIGNUP_WINDOW_MS = 60 * 60 * 1000L;

    private final UserRepository userRepository;
    private final PasswordUtil passwordUtil;
    private final JwtUtil jwtUtil;
    private final AttemptRateLimiter rateLimiter;

    public AuthService(UserRepository userRepository, PasswordUtil passwordUtil,
                        JwtUtil jwtUtil, AttemptRateLimiter rateLimiter) {
        this.userRepository = userRepository;
        this.passwordUtil = passwordUtil;
        this.jwtUtil = jwtUtil;
        this.rateLimiter = rateLimiter;
    }

    public AuthResponse signup(SignupRequest request, String clientIp) {
        String ipKey = "signup:ip:" + clientIp;
        rateLimiter.check(ipKey, SIGNUP_MAX_ATTEMPTS, SIGNUP_WINDOW_MS);
        rateLimiter.recordAttempt(ipKey, SIGNUP_WINDOW_MS);

        if (userRepository.existsByEmail(request.getEmail())) {
            throw ApiException.conflict("An account with this email already exists");
        }

        User user = new User(
                request.getName().trim(),
                request.getEmail().trim().toLowerCase(),
                passwordUtil.hash(request.getPassword()),
                Role.USER
        );
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserResponse.from(user));
    }

    public AuthResponse login(LoginRequest request, String clientIp) {
        String email = request.getEmail().trim().toLowerCase();
        String emailKey = "login:email:" + email;
        String ipKey = "login:ip:" + clientIp;

        // Check both: a locked-out account stays locked regardless of which
        // IP is trying it, and a locked-out IP can't just try a different
        // email to route around the limit.
        rateLimiter.check(emailKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);
        rateLimiter.check(ipKey, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS);

        Optional<User> maybeUser = userRepository.findByEmail(email);
        boolean valid = maybeUser.isPresent()
                && passwordUtil.matches(request.getPassword(), maybeUser.get().getPasswordHash());

        if (!valid) {
            rateLimiter.recordAttempt(emailKey, LOGIN_WINDOW_MS);
            rateLimiter.recordAttempt(ipKey, LOGIN_WINDOW_MS);
            throw ApiException.unauthorized("Invalid email or password");
        }

        rateLimiter.clear(emailKey);
        rateLimiter.clear(ipKey);

        User user = maybeUser.get();
        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        return new AuthResponse(token, UserResponse.from(user));
    }

    public UserResponse getById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("User not found"));
        return UserResponse.from(user);
    }
}
