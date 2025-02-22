package com.auction.my.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuctionDto {

    private Long id;
    private String title;
    private String description;
    private Double startingPrice;
    private Double currentHighestBid;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String category;
    private String brand;
    private Long views;
    private Long sellerId;
    private String sellerImage ;
    private String sellerUsername;
    private Long currentHighestBidId;
    private String currentHighestBidderUsername;
    private String frontImage;
    private List<String> additionalImages;




}
