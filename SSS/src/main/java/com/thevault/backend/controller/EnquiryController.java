package com.thevault.backend.controller;

import com.thevault.backend.dto.EnquiryRequest;
import com.thevault.backend.service.EnquiryService;
import com.thevault.backend.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public, unauthenticated endpoint: a customer clicking "ask about this
 * piece" or "order via WhatsApp" isn't necessarily signed in, and shouldn't
 * need to be for the studio to hear about it.
 */
@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody EnquiryRequest request,
                                        HttpServletRequest httpRequest) {
        String ip = RequestUtils.getClientIp(httpRequest);
        enquiryService.create(request, ip);
        return ResponseEntity.status(201).build();
    }
}
