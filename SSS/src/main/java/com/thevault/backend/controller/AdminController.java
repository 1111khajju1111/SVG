package com.thevault.backend.controller;

import com.thevault.backend.dto.AdminStatsResponse;
import com.thevault.backend.dto.EnquiryResponse;
import com.thevault.backend.model.Role;
import com.thevault.backend.repository.EnquiryRepository;
import com.thevault.backend.repository.ProductRepository;
import com.thevault.backend.repository.UserRepository;
import com.thevault.backend.security.AuthGuard;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Backs the admin dashboard's stat tiles and enquiries panel. Everything
 * here is a live query — nothing in this response is a placeholder.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EnquiryRepository enquiryRepository;

    public AdminController(ProductRepository productRepository, UserRepository userRepository,
                            EnquiryRepository enquiryRepository) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.enquiryRepository = enquiryRepository;
    }

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> stats() {
        AuthGuard.requireAdmin();
        long listings = productRepository.count();
        long signups = userRepository.countByRole(Role.USER);
        long enquiries = enquiryRepository.count();
        return ResponseEntity.ok(new AdminStatsResponse(listings, signups, enquiries));
    }

    @GetMapping("/enquiries")
    public ResponseEntity<List<EnquiryResponse>> enquiries() {
        AuthGuard.requireAdmin();
        List<EnquiryResponse> results = enquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(EnquiryResponse::from)
                .toList();
        return ResponseEntity.ok(results);
    }

    @DeleteMapping("/enquiries/{id}")
    public ResponseEntity<Void> deleteEnquiry(@PathVariable Long id) {
        AuthGuard.requireAdmin();
        enquiryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
