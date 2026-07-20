package com.thevault.backend.util;

import jakarta.servlet.http.HttpServletRequest;

public final class RequestUtils {

    private RequestUtils() {
    }

    /**
     * Most hosts (Render, Railway, behind nginx, etc.) sit your app behind a
     * proxy, so request.getRemoteAddr() would just return the proxy's IP.
     * X-Forwarded-For carries the original client IP as the first entry.
     */
    public static String getClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
