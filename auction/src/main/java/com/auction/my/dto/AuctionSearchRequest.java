package com.auction.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuctionSearchRequest {
    private String keyword;
    private Double minPrice;
    private Double maxPrice;
    private Boolean includeEnded;
    private String sortBy;
    private String sortDirection;
}