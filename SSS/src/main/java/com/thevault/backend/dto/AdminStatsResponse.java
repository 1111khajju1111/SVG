package com.thevault.backend.dto;

public class AdminStatsResponse {

    private long listings;
    private long signups;
    private long enquiries;

    public AdminStatsResponse() {
    }

    public AdminStatsResponse(long listings, long signups, long enquiries) {
        this.listings = listings;
        this.signups = signups;
        this.enquiries = enquiries;
    }

    public long getListings() {
        return listings;
    }

    public void setListings(long listings) {
        this.listings = listings;
    }

    public long getSignups() {
        return signups;
    }

    public void setSignups(long signups) {
        this.signups = signups;
    }

    public long getEnquiries() {
        return enquiries;
    }

    public void setEnquiries(long enquiries) {
        this.enquiries = enquiries;
    }
}
