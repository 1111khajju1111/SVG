package com.thevault.backend.security;

import com.thevault.backend.exception.ApiException;

/** Replaces @PreAuthorize / Spring Security's method security with two explicit calls. */
public final class AuthGuard {

    private AuthGuard() {
    }

    public static AuthenticatedUser requireAuth() {
        AuthenticatedUser user = CurrentUserContext.get();
        if (user == null) {
            throw ApiException.unauthorized("Sign in required");
        }
        return user;
    }

    public static AuthenticatedUser requireAdmin() {
        AuthenticatedUser user = requireAuth();
        if (!user.isAdmin()) {
            throw ApiException.forbidden("Admin access required");
        }
        return user;
    }
}
