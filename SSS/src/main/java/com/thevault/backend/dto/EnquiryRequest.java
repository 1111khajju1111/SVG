package com.thevault.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class EnquiryRequest {

    @NotBlank(message = "is required")
    private String type; // PRODUCT | ORDER | CONTACT — validated/parsed in the service

    private Long productId;
    private String productName;
    private String customerName;
    private String customerContact;
    private String message;

    public EnquiryRequest() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerContact() {
        return customerContact;
    }

    public void setCustomerContact(String customerContact) {
        this.customerContact = customerContact;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
