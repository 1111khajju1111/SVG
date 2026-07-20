package com.thevault.backend.security;

/**
 * Request-scoped (via ThreadLocal) access to whoever the JWT identified.
 * JwtAuthFilter sets this at the start of a request and always clears it
 * in a finally block, so it never leaks between requests on a pooled thread.
 */
public final class CurrentUserContext {

    private static final ThreadLocal<AuthenticatedUser> CURRENT = new ThreadLocal<>();

    private CurrentUserContext() {
    }

    public static void set(AuthenticatedUser user) {
        CURRENT.set(user);
    }

    public static AuthenticatedUser get() {
        return CURRENT.get();
    }

    public static void clear() {
        CURRENT.remove();
    }
}
