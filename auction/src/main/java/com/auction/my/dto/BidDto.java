package com.auction.my.dto;

import lombok.*;

import java.time.LocalDateTime;



@Setter
@Getter
public class BidDto {
    private Long id;
    private Long auctionId;
    private Long bidderId;
    private String bidderUsername;
    private Double amount;
    private LocalDateTime bidTime;
    private String auctionTitle;
    private LocalDateTime auctionEndTime;

    public BidDto(Long id, Long auctionId, Long bidderId, String bidderUsername, Double amount, LocalDateTime bidTime, LocalDateTime auctionEndTime, String auctionTitle) {
        this.id = id;
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.bidderUsername = bidderUsername;
        this.amount = amount;
        this.bidTime = bidTime;
        this.auctionEndTime = auctionEndTime;
        this.auctionTitle = String.valueOf(auctionTitle);
    }


}

