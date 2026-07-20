package com.thevault.backend.config;

import com.thevault.backend.security.AuthenticatedUser;
import com.thevault.backend.security.CurrentUserContext;
import com.thevault.backend.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Plain jakarta.servlet filter (OncePerRequestFilter lives in spring-web, not
 * spring-security) that decodes a Bearer JWT if present and stores the result
 * in CurrentUserContext for the duration of the request.
 *
 * It never rejects a request itself — a missing/invalid token just means no
 * authenticated user is attached. Route-level enforcement happens via
 * AuthGuard.requireAuth() / requireAdmin() inside the controllers that need it,
 * which is what makes this "no Spring Security" instead of using its filter
 * chain + AccessDecisionManager.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtAuthFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                     FilterChain filterChain) throws ServletException, IOException {
        try {
            String header = request.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                try {
                    Claims claims = jwtUtil.parseClaims(token);
                    Long userId = Long.valueOf(claims.getSubject());
                    String email = claims.get("email", String.class);
                    String role = claims.get("role", String.class);
                    CurrentUserContext.set(new AuthenticatedUser(userId, email, role));
                } catch (JwtException | IllegalArgumentException ex) {
                    // Invalid/expired token: leave CurrentUserContext empty.
                    // Protected routes will reject via AuthGuard; public routes
                    // simply continue unauthenticated.
                }
            }
            filterChain.doFilter(request, response);
        } finally {
            CurrentUserContext.clear();
        }
    }
}
