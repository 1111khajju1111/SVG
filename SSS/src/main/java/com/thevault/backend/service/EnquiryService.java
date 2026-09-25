package com.thevault.backend.service;

import com.thevault.backend.dto.EnquiryRequest;
import com.thevault.backend.exception.ApiException;
import com.thevault.backend.model.Enquiry;
import com.thevault.backend.model.EnquiryType;
import com.thevault.backend.repository.EnquiryRepository;
import com.thevault.backend.security.AttemptRateLimiter;
import org.springframework.stereotype.Service;

@Service
public class EnquiryService {

    // Generous on purpose — this logs genuine storefront clicks (product
    // enquiries, cart checkouts, the contact form), not a login form, so the
    // limit only needs to stop scripted abuse, not a real browsing customer.
    private static final int MAX_ATTEMPTS = 30;
    private static final long WINDOW_MS = 60 * 60 * 1000L;

    private final EnquiryRepository enquiryRepository;
    private final AttemptRateLimiter rateLimiter;

    public EnquiryService(EnquiryRepository enquiryRepository, AttemptRateLimiter rateLimiter) {
        this.enquiryRepository = enquiryRepository;
        this.rateLimiter = rateLimiter;
    }

    public void create(EnquiryRequest request, String clientIp) {
        String key = "enquiry:ip:" + clientIp;
        rateLimiter.check(key, MAX_ATTEMPTS, WINDOW_MS);
        rateLimiter.recordAttempt(key, WINDOW_MS);

        EnquiryType type = parseType(request.getType());

        Enquiry enquiry = new Enquiry(
                type,
                request.getProductId(),
                trim(request.getProductName(), 150),
                trim(request.getCustomerName(), 120),
                trim(request.getCustomerContact(), 180),
                trim(request.getMessage(), 500)
        );
        enquiryRepository.save(enquiry);
    }

    private EnquiryType parseType(String raw) {
        if (raw == null || raw.isBlank()) {
            throw ApiException.badRequest("type is required");
        }
        try {
            return EnquiryType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw ApiException.badRequest("type must be one of PRODUCT, ORDER, CONTACT");
        }
    }

    private String trim(String value, int maxLength) {
        if (value == null) return null;
        String v = value.trim();
        if (v.isEmpty()) return null;
        return v.length() > maxLength ? v.substring(0, maxLength) : v;
    }
}
