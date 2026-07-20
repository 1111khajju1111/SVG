package com.thevault.backend.service;

import com.thevault.backend.dto.ProductResponse;
import com.thevault.backend.exception.ApiException;
import com.thevault.backend.model.Product;
import com.thevault.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ImageStorage imageStorage;

    public ProductService(ProductRepository productRepository, ImageStorage imageStorage) {
        this.productRepository = productRepository;
        this.imageStorage = imageStorage;
    }

    public List<ProductResponse> findAll(String category) {
        List<Product> products = (category == null || category.isBlank() || category.equalsIgnoreCase("all"))
                ? productRepository.findAll()
                : productRepository.findByCategoryIgnoreCase(category);
        return products.stream().map(ProductResponse::from).toList();
    }

    public ProductResponse findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));
        return ProductResponse.from(product);
    }

    public ProductResponse create(String name, String category, String metal, String stone,
                                   BigDecimal price, String description, MultipartFile image) {
        if (name == null || name.isBlank()) {
            throw ApiException.badRequest("Product name is required");
        }
        if (price == null || price.signum() < 0) {
            throw ApiException.badRequest("A valid price is required");
        }

        String imageUrl = imageStorage.store(image);

        Product product = new Product(name.trim(), category, metal, stone, price, description, imageUrl);
        productRepository.save(product);
        return ProductResponse.from(product);
    }

    public ProductResponse update(Long id, String name, String category, String metal, String stone,
                                   BigDecimal price, String description, MultipartFile image) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> ApiException.notFound("Product not found"));

        if (name != null && !name.isBlank()) product.setName(name.trim());
        if (category != null) product.setCategory(category);
        if (metal != null) product.setMetal(metal);
        if (stone != null) product.setStone(stone);
        if (price != null) product.setPrice(price);
        if (description != null) product.setDescription(description);
        if (image != null && !image.isEmpty()) {
            product.setImageUrl(imageStorage.store(image));
        }

        productRepository.save(product);
        return ProductResponse.from(product);
    }

    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw ApiException.notFound("Product not found");
        }
        productRepository.deleteById(id);
    }
}
