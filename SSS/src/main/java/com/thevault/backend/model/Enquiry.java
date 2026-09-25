package com.thevault.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * A lead captured somewhere on the storefront: a "customize this piece"
 * click on a product page, a cart WhatsApp checkout, or the contact form.
 * None of these used to leave a trace anywhere but the customer's own
 * WhatsApp app — this is what the admin dashboard's "Enquiries" stat and
 * enquiries panel are actually backed by.
 *
 * productId is intentionally a plain Long, not a @ManyToOne to Product: an
 * enquiry should still exist (with its productName snapshot) even after the
 * product itself is deleted from the catalog.
 */
@Entity
@Table(name = "enquiries")
public class Enquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EnquiryType type;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name", length = 150)
    private String productName;

    @Column(name = "customer_name", length = 120)
    private String customerName;

    @Column(name = "customer_contact", length = 180)
    private String customerContact;

    @Column(length = 500)
    private String message;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Enquiry() {
    }

    public Enquiry(EnquiryType type, Long productId, String productName,
                    String customerName, String customerContact, String message) {
        this.type = type;
        this.productId = productId;
        this.productName = productName;
        this.customerName = customerName;
        this.customerContact = customerContact;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EnquiryType getType() {
        return type;
    }

    public void setType(EnquiryType type) {
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
