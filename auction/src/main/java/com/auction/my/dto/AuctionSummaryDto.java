package com.auction.my.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

public class AuctionSummaryDto {
    private Long id;
    private String title;
    private Double currentHighestBid;
    private LocalDateTime endTime;
//    @Getter
//    @Setter
//    private LocalDateTime creationDate;

    public AuctionSummaryDto(Long id, String title, Double currentHighestBid, LocalDateTime endTime) {
        this.id = id;
        this.title = title;
        this.currentHighestBid = currentHighestBid;
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Double getCurrentHighestBid() {
        return currentHighestBid;
    }

    public void setCurrentHighestBid(Double currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}
