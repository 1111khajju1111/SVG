package com.thevault.backend.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Whichever implementation is active (see app.storage.provider), the rest
 * of the app only ever talks to this interface — ProductService doesn't
 * know or care whether an image ended up on local disk or in a bucket.
 */
public interface ImageStorage {

    /** Validates, stores, and returns a URL for the image (relative for local, absolute for S3/R2). */
    String store(MultipartFile file);
}
