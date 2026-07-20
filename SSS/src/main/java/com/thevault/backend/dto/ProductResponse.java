package com.thevault.backend.dto;

import com.thevault.backend.model.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String name;
    private String category;
    private String metal;
    private String stone;
    private BigDecimal price;
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;

    public ProductResponse() {
    }

    public static ProductResponse from(Product p) {
        ProductResponse r = new ProductResponse();
        r.id = p.getId();
        r.name = p.getName();
        r.category = p.getCategory();
        r.metal = p.getMetal();
        r.stone = p.getStone();
        r.price = p.getPrice();
        r.description = p.getDescription();
        r.imageUrl = p.getImageUrl();
        r.createdAt = p.getCreatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMetal() {
        return metal;
    }

    public void setMetal(String metal) {
        this.metal = metal;
    }

    public String getStone() {
        return stone;
    }

    public void setStone(String stone) {
        this.stone = stone;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
