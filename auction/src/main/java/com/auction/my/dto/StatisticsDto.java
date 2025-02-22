package com.auction.my.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.Month;
import java.util.Map;

@Setter
@Getter
public class StatisticsDto {
    // Getters and setters
    private long totalClients;
    private long totalAuctionItems;
    private long totalUnsoldAuctionItems;
    private double totalRevenue;
    private Map<Integer, Long> monthlyAuctionItemCounts;
    private Map<Month, Double> monthlyRevenue;

    public StatisticsDto(long totalClients, long totalAuctionItems, long totalUnsoldAuctionItems, double totalRevenue,
                         Map<Integer, Long> monthlyAuctionItemCounts, Map<Month, Double> monthlyRevenue) {
        this.totalClients = totalClients;
        this.totalAuctionItems = totalAuctionItems;
        this.totalUnsoldAuctionItems = totalUnsoldAuctionItems;
        this.totalRevenue = totalRevenue;
        this.monthlyAuctionItemCounts = monthlyAuctionItemCounts;
        this.monthlyRevenue = monthlyRevenue;
    }

}
