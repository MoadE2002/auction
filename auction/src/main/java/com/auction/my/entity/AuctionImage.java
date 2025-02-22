package com.auction.my.entity;

import jakarta.persistence.*;
import lombok.*;

@Setter
@Getter
@Entity
@Data
@Builder
public class AuctionImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;



    @Lob
    @Column(nullable = false)
    private byte[] image;

    @ManyToOne
    @JoinColumn(name = "auction_item_id", nullable = false)
    private AuctionItem auctionItem;

    public AuctionImage(Long id, byte[] image, AuctionItem auctionItem) {
        this.id = id;
        this.image = image;
        this.auctionItem = auctionItem;
    }

    public AuctionImage(){

    }

}
