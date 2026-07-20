package com.thevault.backend.controller;

import com.thevault.backend.dto.ProductResponse;
import com.thevault.backend.security.AuthGuard;
import com.thevault.backend.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // ---- Public catalog ----

    @GetMapping("/api/products")
    public ResponseEntity<List<ProductResponse>> findAll(
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(productService.findAll(category));
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<ProductResponse> findById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.findById(id));
    }

    // ---- Admin-only writes ----

    @PostMapping(value = "/api/admin/products", consumes = "multipart/form-data")
    public ResponseEntity<ProductResponse> create(
            @RequestParam String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String metal,
            @RequestParam(required = false) String stone,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam("image") MultipartFile image
    ) {
        AuthGuard.requireAdmin();
        ProductResponse created = productService.create(name, category, metal, stone, price, description, image);
        return ResponseEntity.status(201).body(created);
    }

    @PutMapping(value = "/api/admin/products/{id}", consumes = "multipart/form-data")
    public ResponseEntity<ProductResponse> update(
            @PathVariable Long id,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String metal,
            @RequestParam(required = false) String stone,
            @RequestParam(required = false) BigDecimal price,
            @RequestParam(required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        AuthGuard.requireAdmin();
        return ResponseEntity.ok(productService.update(id, name, category, metal, stone, price, description, image));
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        AuthGuard.requireAdmin();
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
