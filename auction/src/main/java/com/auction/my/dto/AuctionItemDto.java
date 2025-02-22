package com.auction.my.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;



@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AuctionItemDto {
    private Long id;
    private String title;
    private String description;
    private Double startingPrice;
    private Double currentHighestBid;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long sellerId;
    private String sellerImage ;
    private String sellerUsername;
    private Long currentHighestBidId;
    private String currentHighestBidderUsername;
    private String frontImage;
    private List<String> additionalImages;
    private String category;
    private String brand;
    private Long views = 0L;


}
