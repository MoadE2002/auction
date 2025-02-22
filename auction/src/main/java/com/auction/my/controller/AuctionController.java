package com.auction.my.controller;

/**
 * @author Moad
 **/


import com.auction.my.dto.AuctionItemDto;
import com.auction.my.dto.AuctionItemDtoWithoutImages;
import com.auction.my.dto.CreateAuctionRequest;
import com.auction.my.dto.UpdateAuctionRequest;
import com.auction.my.entity.AuctionItem;
import com.auction.my.service.AuctionService;

import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/auctions")
public class AuctionController {

    private final AuctionService auctionService;

    public AuctionController(AuctionService auctionService) {
        this.auctionService = auctionService;
    }

    /**
     * Create a new auction.
     */
    @PostMapping
    public ResponseEntity<AuctionItemDto> createAuction(@RequestBody CreateAuctionRequest request) {
        AuctionItemDto createdAuction = auctionService.createAuction(request);
        return ResponseEntity.ok(createdAuction);
    }

    /**
     * Get an auction by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AuctionItemDto> getAuctionById(@PathVariable Long id) {

        AuctionItemDto auction = auctionService.getAuctionById(id);
        auctionService.updateViews(auction.getViews()+1, auction.getId());

        return ResponseEntity.ok(auction);
    }
    @GetMapping("/get/{id}")
    public ResponseEntity<AuctionItemDtoWithoutImages> getAuctionByIdWithoutImages(@PathVariable Long id) {
        AuctionItemDto auction = auctionService.getAuctionById(id);
        auctionService.updateViews(auction.getViews() + 1, auction.getId());

        AuctionItemDtoWithoutImages auctionWithoutImages = new AuctionItemDtoWithoutImages(
                auction.getId(),
                auction.getTitle(),
                auction.getDescription(),
                auction.getStartingPrice(),
                auction.getCurrentHighestBid(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getSellerId(),
                auction.getSellerUsername(),
                auction.getCurrentHighestBidId(),
                auction.getCurrentHighestBidderUsername(),
                auction.getCategory(),
                auction.getBrand(),
                auction.getViews()
        );

        return ResponseEntity.ok(auctionWithoutImages);
    }

    /**
     * Get all auctions with pagination and optional sorting.
     */
    @GetMapping("/all")
    public ResponseEntity<Page<AuctionItemDtoWithoutImages>> getAllAuctions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
            ) {
        Page<AuctionItemDtoWithoutImages> auctions = auctionService.getAllAuctions(page, size);
        return ResponseEntity.ok(auctions);
    }

    /**
     * Update an existing auction.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AuctionItemDto> updateAuction(
            @PathVariable Long id,
            @Valid @RequestBody UpdateAuctionRequest request) {
        AuctionItemDto updatedAuction = auctionService.updateAuction(id, request);
        return ResponseEntity.ok(updatedAuction);
    }

    /**
     * Delete an auction by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuction(@PathVariable Long id) {
        auctionService.deleteAuction(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all active auctions with pagination.
     */
    @GetMapping("/active")
    public ResponseEntity<Page<AuctionItemDto>> getActiveAuctions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AuctionItemDto> activeAuctions = auctionService.getActiveAuctions(page, size);
        return ResponseEntity.ok(activeAuctions);
    }
    @GetMapping("/filtered")
    public ResponseEntity<Page<AuctionItemDto>> getAuctions(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<AuctionItemDto> auctions = auctionService.getAuctionsByFilters(title, category, brand, minPrice, maxPrice, page, size);
        return ResponseEntity.ok(auctions);
    }
    /**
     * Get auctions created by a specific user.
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<AuctionItemDto>> getUserAuctions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AuctionItemDto> userAuctions = auctionService.getUserAuctions(userId, page, size);
        return ResponseEntity.ok(userAuctions);
    }

    /**
     * Close an auction by ID.
     */
    @PostMapping("/{id}/close")
    public ResponseEntity<AuctionItemDto> closeAuction(@PathVariable Long id) {
        AuctionItemDto closedAuction = auctionService.closeAuction(id);
        return ResponseEntity.ok(closedAuction);
    }
}
