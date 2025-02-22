package com.auction.my.controller;

/**
 * @author Moad
 **/
import com.auction.my.dto.AuctionSummaryDto;
import com.auction.my.dto.StatisticsDto;
import com.auction.my.entity.AuctionItem;
import com.auction.my.repository.AuctionItemRepository;
import com.auction.my.repository.UserRepository;
import com.auction.my.service.AuctionService;
import com.auction.my.service.JwtService;
import com.auction.my.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Month;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    private final UserRepository userRepository;
    private final AuctionItemRepository auctionItemRepository;
    private final UserService userService;
    private final JwtService jwtService;
    private final AuctionService auctionService;

    public StatisticsController(UserRepository userRepository, AuctionItemRepository auctionItemRepository, UserService userService, JwtService jwtService, AuctionService auctionService) {
        this.userRepository = userRepository;
        this.auctionItemRepository = auctionItemRepository;
        this.userService = userService;
        this.jwtService = jwtService;
        this.auctionService = auctionService;
    }

    @GetMapping
    public ResponseEntity<StatisticsDto> getStatistics() {
        // Total clients
        long totalClients = userRepository.count();

        // Total auction items and unsold auction items
        long totalAuctionItems = auctionItemRepository.count();
        long totalUnsoldAuctionItems = auctionItemRepository.countByIsSoldFalse();

        // Sold auctions and total revenue
        List<AuctionSummaryDto> soldAuctions = auctionItemRepository.findAllByIsSoldTrue();
        double totalRevenue = soldAuctions.stream()
                .mapToDouble(auction -> auction.getCurrentHighestBid() * 0.05)
                .sum();

        // Monthly auction item counts
        Map<Integer, Long> monthlyCounts = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            monthlyCounts.put(i, 0L);
        }
        Map<Integer, Long> auctionItemCounts = auctionService.getAuctionItemCountByMonth();
        auctionItemCounts.forEach(monthlyCounts::put);

        // Monthly revenue
        Map<Month, Double> monthlyRevenue = new HashMap<>();
        for (Month month : Month.values()) {
            monthlyRevenue.put(month, 0.0);
        }
        soldAuctions.forEach(auction -> {
            Month month = auction.getEndTime().getMonth();
            double revenue = auction.getCurrentHighestBid() * 0.05;
            monthlyRevenue.put(month, monthlyRevenue.get(month) + revenue);
        });

        // Create StatisticsDto
        StatisticsDto statistics = new StatisticsDto(
                totalClients,
                totalAuctionItems,
                totalUnsoldAuctionItems,
                totalRevenue,
                monthlyCounts,
                monthlyRevenue
        );

        return ResponseEntity.ok(statistics);
    }
}
