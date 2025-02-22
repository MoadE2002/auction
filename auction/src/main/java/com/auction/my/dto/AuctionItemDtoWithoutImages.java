package com.auction.my.dto;

import lombok.*;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AuctionItemDtoWithoutImages {
    private Long id;
    private String title;
    private String description;
    private Double startingPrice;
    private Double currentHighestBid;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long sellerId;
    private String sellerUsername;
    private Long currentHighestBidId;
    private String currentHighestBidderUsername;
    private String category;
    private String brand;
    private Long views = 0L;
}
