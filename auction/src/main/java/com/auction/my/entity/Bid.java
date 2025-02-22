package com.auction.my.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor

public class Bid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "auction_item_id", nullable = false)
    private AuctionItem auctionItem;

    @ManyToOne
    @JoinColumn(name = "bidder_id", nullable = false)
    private User bidder;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AuctionItem getAuctionItem() {
        return auctionItem;
    }

    public void setAuctionItem(AuctionItem auctionItem) {
        this.auctionItem = auctionItem;
    }

    public User getBidder() {
        return bidder;
    }

    public void setBidder(User bidder) {
        this.bidder = bidder;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getBidTime() {
        return bidTime;
    }

    public void setBidTime(LocalDateTime bidTime) {
        this.bidTime = bidTime;
    }

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDateTime bidTime;
    public Bid(AuctionItem auctionItem, User bidder, double amount, LocalDateTime bidTime) {
        this.auctionItem = auctionItem;
        this.bidder = bidder;
        this.amount = amount;
        this.bidTime = bidTime;
    }

}
