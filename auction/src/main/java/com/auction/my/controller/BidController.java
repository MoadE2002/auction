package com.auction.my.controller;

import com.auction.my.dto.BidDto;
import com.auction.my.dto.PlaceBidRequest;
import com.auction.my.exception.UnauthorizedException;
import com.auction.my.service.AuctionService;
import com.auction.my.service.BidService;
import com.auction.my.service.JwtService;
import com.auction.my.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/api/bids")
public class BidController {

    private final BidService bidService;
    private final JwtService jwtService;
    private final AuctionService auctionService;

    public BidController(BidService bidService, JwtService jwtService, UserService userService, AuctionService auctionService) {
        this.bidService = bidService;
        this.jwtService = jwtService;
        this.auctionService = auctionService;
    }

    /**
     * Place a bid on an auction item.
     */
    @PostMapping("/{auctionId}")
    public ResponseEntity<BidDto> placeBid(
            @PathVariable Long auctionId,
            @RequestBody PlaceBidRequest request,
            @RequestHeader("Authorization") String authorization
            ) {

        String jwtToken = authorization.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtService.extractUserId(jwtToken));  // Extract the user ID from the JWT token
        Long ownerId = auctionService.getAuctionById(auctionId).getSellerId();
        if (Objects.equals(userId, ownerId)) {
            throw new UnauthorizedException("You are not authorized to bid on your own products");
        }
        BidDto bidDto = bidService.placeBid(auctionId, request);

        return ResponseEntity.ok(bidDto);
    }

    /**
     * Get all bids for a specific auction item.
     */
    @GetMapping("/auction/{auctionId}")
    public ResponseEntity<Page<BidDto>> getAuctionBids(
            @PathVariable Long auctionId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<BidDto> bids = bidService.getAuctionBids(auctionId, page, size);
        return ResponseEntity.ok(bids);
    }

    /**
     * Get all bids placed by the current user.
     */
    @GetMapping("/user")
    public ResponseEntity<Page<BidDto>> getCurrentUserBids(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // This checks if the user is authenticated by the JWT token
        Page<BidDto> bids = bidService.getCurrentUserBids(page, size);
        return ResponseEntity.ok(bids);
    }
    @GetMapping("/user/highest")
    public ResponseEntity<Page<BidDto>> getCurrentUserHighestBids(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<BidDto> highestBids = bidService.getCurrentUserHighestBids(page, size);
        return ResponseEntity.ok(highestBids);
    }

    /**
     * Get the highest bid for a specific auction item.
     */
    @GetMapping("/auction/{auctionId}/highest")
    public ResponseEntity<BidDto> getHighestBid(@PathVariable Long auctionId) {
        BidDto highestBid = bidService.getHighestBid(auctionId);
        return highestBid != null ? ResponseEntity.ok(highestBid) : ResponseEntity.noContent().build();
    }
}
