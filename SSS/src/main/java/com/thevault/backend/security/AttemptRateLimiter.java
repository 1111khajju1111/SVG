package com.thevault.backend.security;

import com.thevault.backend.exception.ApiException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple in-memory rate limiter, keyed by an arbitrary string (e.g.
 * "login:email:x@y.com" or "login:ip:1.2.3.4"). No extra dependency (like
 * Bucket4j + Redis) on purpose — this is a single-instance deployment, and
 * an in-memory counter is enough to stop casual brute-forcing. If this ever
 * runs behind a load balancer with multiple app instances, move this to
 * Redis so all instances share the same counters.
 */
@Component
public class AttemptRateLimiter {

    private final ConcurrentHashMap<String, Attempt> attempts = new ConcurrentHashMap<>();

    /** Throws ApiException (429) if `key` has hit `maxAttempts` within `windowMillis`. */
    public void check(String key, int maxAttempts, long windowMillis) {
        Attempt attempt = attempts.get(key);
        if (attempt == null) return;

        long now = System.currentTimeMillis();
        if (now - attempt.windowStart > windowMillis) {
            attempts.remove(key);
            return;
        }

        if (attempt.count.get() >= maxAttempts) {
            long retryAfterMinutes = Math.max(1, (windowMillis - (now - attempt.windowStart)) / 60_000);
            throw ApiException.tooManyRequests(
                    "Too many attempts. Try again in " + retryAfterMinutes + " minute(s).");
        }
    }

    public void recordAttempt(String key, long windowMillis) {
        long now = System.currentTimeMillis();
        attempts.compute(key, (k, existing) -> {
            if (existing == null || now - existing.windowStart > windowMillis) {
                return new Attempt(now);
            }
            existing.count.incrementAndGet();
            return existing;
        });
    }

    public void clear(String key) {
        attempts.remove(key);
    }

    /** Sweeps stale entries every 30 minutes so this map can't grow unbounded. */
    @Scheduled(fixedRate = 30 * 60 * 1000)
    public void cleanup() {
        long now = System.currentTimeMillis();
        long maxAnyWindow = 24L * 60 * 60 * 1000; // generous upper bound across all callers
        attempts.entrySet().removeIf(e -> now - e.getValue().windowStart > maxAnyWindow);
    }

    private static class Attempt {
        final AtomicInteger count = new AtomicInteger(1);
        final long windowStart;

        Attempt(long windowStart) {
            this.windowStart = windowStart;
        }
    }
}
