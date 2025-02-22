package com.auction.my.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;


@Entity
@AllArgsConstructor
@Getter
@Setter
public class AuctionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 5000)
    private String description;

    @Column(nullable = false)
    private Double startingPrice;

    @Column(nullable = false)
    private LocalDateTime startTime ;

    @Column(nullable = false)
    private LocalDateTime endTime;

    @ManyToOne
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @OneToMany(mappedBy = "auctionItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Bid> bids;

    @Column
    private Double currentHighestBid;


    private String brand = "other";

    private Long views = 0L;
    @Column
    private String category = "other";;

    @Column
    private  Boolean isSold ;

    @Lob
    @Column(nullable = false)
    @Basic(fetch = FetchType.EAGER)
    private byte[] frontImage;

    @OneToMany(mappedBy = "auctionItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AuctionImage> additionalImages;



    public AuctionItem(String category, Long id, String title, String description, Double startingPrice, LocalDateTime startTime, LocalDateTime endTime, User seller, Set<Bid> bids, Double currentHighestBid, Boolean isSold, byte[] frontImage, Set<AuctionImage> additionalImages) {
        this.category = category;
        this.id = id;

        this.title = title;
        this.description = description;
        this.startingPrice = startingPrice;
        this.startTime = LocalDateTime.now();
        this.endTime = endTime;
        this.seller = seller;
        this.bids = bids;
        this.currentHighestBid = currentHighestBid;
        this.isSold = isSold;
        this.frontImage = frontImage;
        this.additionalImages = additionalImages;
        this.views = 0L ;
    }
    public AuctionItem() {}

    public Double getCurrentHighestBid() {
        return currentHighestBid;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Double getStartingPrice() {
        return startingPrice;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public User getSeller() {
        return seller;
    }

    public Set<Bid> getBids() {
        return bids;
    }

    public String getCategory() {
        return category;
    }

    public Boolean getSold() {
        return isSold;
    }

    public byte[] getFrontImage() {
        return frontImage;
    }

    public Set<AuctionImage> getAdditionalImages() {
        return additionalImages;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setStartingPrice(Double startingPrice) {
        this.startingPrice = startingPrice;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public void setBids(Set<Bid> bids) {
        this.bids = bids;
    }

    public void setCurrentHighestBid(Double currentHighestBid) {
        this.currentHighestBid = currentHighestBid;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setSold(Boolean sold) {
        isSold = sold;
    }

    public void setFrontImage(byte[] frontImage) {
        this.frontImage = frontImage;
    }

    public void setAdditionalImages(Set<AuctionImage> additionalImages) {
        this.additionalImages = additionalImages;
    }
}
