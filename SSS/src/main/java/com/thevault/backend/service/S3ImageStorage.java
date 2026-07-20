package com.thevault.backend.service;

import com.thevault.backend.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3ClientBuilder;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.List;
import java.util.UUID;

/**
 * Stores images in an S3 bucket or, via app.storage.s3.endpoint, any
 * S3-compatible store — this is written and tested primarily against
 * Cloudflare R2, which has no egress fees (good for a storefront serving
 * product photos on every page load) and speaks the same S3 API. Real AWS
 * S3 works too — just leave app.storage.s3.endpoint blank.
 *
 * Activate with app.storage.provider=s3 (see application.properties and
 * the README for the full env var list).
 */
@Service
@ConditionalOnProperty(prefix = "app.storage", name = "provider", havingValue = "s3")
public class S3ImageStorage implements ImageStorage {

    private static final List<String> ALLOWED_TYPES =
            List.of("image/png", "image/jpeg", "image/webp", "image/avif");
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5MB

    private final S3Client s3Client;
    private final String bucket;
    private final String publicBaseUrl;

    public S3ImageStorage(
            @Value("${app.storage.s3.region}") String region,
            @Value("${app.storage.s3.endpoint:}") String endpoint,
            @Value("${app.storage.s3.access-key}") String accessKey,
            @Value("${app.storage.s3.secret-key}") String secretKey,
            @Value("${app.storage.s3.bucket}") String bucket,
            @Value("${app.storage.s3.public-base-url}") String publicBaseUrl
    ) {
        this.bucket = bucket;
        this.publicBaseUrl = publicBaseUrl.endsWith("/")
                ? publicBaseUrl.substring(0, publicBaseUrl.length() - 1)
                : publicBaseUrl;

        StaticCredentialsProvider credentials =
                StaticCredentialsProvider.create(AwsBasicCredentials.create(accessKey, secretKey));

        S3ClientBuilder builder = S3Client.builder()
                .region(Region.of(region))
                .credentialsProvider(credentials);

        // Leave app.storage.s3.endpoint unset for real AWS S3. Set it for
        // R2 / MinIO / any other S3-compatible provider.
        if (endpoint != null && !endpoint.isBlank()) {
            builder = builder.endpointOverride(URI.create(endpoint));
        }

        this.s3Client = builder.build();
    }

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

        String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "image";
        String extension = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.'))
                : "";
        String key = "products/" + UUID.randomUUID() + extension;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
        } catch (Exception e) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to upload image: " + e.getMessage());
        }

        return publicBaseUrl + "/" + key;
    }
}
