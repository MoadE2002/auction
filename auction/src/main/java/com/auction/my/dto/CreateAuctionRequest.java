package com.auction.my.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;


@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAuctionRequest {

    private String title;
    private String description;
    private Double startingPrice;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String frontImage;
    private String category;
    private String brand;
    private List<String> additionalImages;
}
