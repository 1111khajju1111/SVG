package com.thevault.backend.dto;

import com.thevault.backend.model.Enquiry;

import java.time.LocalDateTime;

public class EnquiryResponse {

    private Long id;
    private String type;
    private Long productId;
    private String productName;
    private String customerName;
    private String customerContact;
    private String message;
    private LocalDateTime createdAt;

    public EnquiryResponse() {
    }

    public static EnquiryResponse from(Enquiry e) {
        EnquiryResponse r = new EnquiryResponse();
        r.id = e.getId();
        r.type = e.getType().name();
        r.productId = e.getProductId();
        r.productName = e.getProductName();
        r.customerName = e.getCustomerName();
        r.customerContact = e.getCustomerContact();
        r.message = e.getMessage();
        r.createdAt = e.getCreatedAt();
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
