package com.thevault.backend.service;

import com.thevault.backend.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

/**
 * Saves images to a local directory on the server's disk. This is the
 * default (app.storage.provider=local, or unset) so the app runs with zero
 * extra setup — but on most hosts (Render, Railway, Heroku-style PaaS) the
 * filesystem is wiped on every redeploy, taking every product photo with
 * it. Fine for local dev; switch to app.storage.provider=s3 before a real
 * production deploy — see S3ImageStorage and the README.
 */
@Service
@ConditionalOnProperty(prefix = "app.storage", name = "provider", havingValue = "local", matchIfMissing = true)
public class LocalImageStorage implements ImageStorage {

    private static final List<String> ALLOWED_TYPES =
            List.of("image/png", "image/jpeg", "image/webp", "image/avif");
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5MB

    @Value("${app.upload-dir}")
    private String uploadDir;

    @Override
    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw ApiException.badRequest("Image file is required");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw ApiException.badRequest("Only PNG, JPEG, WEBP or AVIF images are allowed");
        }
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw ApiException.badRequest("Image must be under 5MB");
        }

        try {
            Path dir = Paths.get(uploadDir);
            Files.createDirectories(dir);

            String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image";
            String extension = originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf('.'))
                    : "";
            String filename = UUID.randomUUID() + extension;

            Path target = dir.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/" + filename;
        } catch (IOException e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to store image: " + e.getMessage());
        }
    }
}
