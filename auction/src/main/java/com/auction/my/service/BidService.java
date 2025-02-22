package com.auction.my.service;

import com.auction.my.dto.BidDto;
import com.auction.my.dto.PlaceBidRequest;
import com.auction.my.entity.AuctionItem;
import com.auction.my.entity.Bid;
import com.auction.my.entity.User;
import com.auction.my.repository.AuctionItemRepository;
import com.auction.my.repository.BidRepository;
import com.auction.my.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BidService {

    private final BidRepository bidRepository;
    private final AuctionItemRepository auctionItemRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    // ✅ Constructor name should match the class name
    public BidService(BidRepository bidRepository, AuctionItemRepository auctionItemRepository, UserRepository userRepository, UserService userService, NotificationService notificationService) {
        this.bidRepository = bidRepository;
        this.auctionItemRepository = auctionItemRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    public BidDto placeBid(Long auctionId, PlaceBidRequest request) {
        AuctionItem auction = auctionItemRepository.findById(auctionId)
                .orElseThrow(() -> new RuntimeException("Auction not found"));

        if (auction.getSold() != null) {
            throw new RuntimeException("Auction is already closed");
        }

        if (auction.getEndTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Auction has ended");
        }

        if (request.getAmount() <= auction.getCurrentHighestBid()) {
            throw new RuntimeException("Bid amount must be higher than current highest bid");
        }

        User bidder = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (auction.getSeller().getId().equals(bidder.getId())) {
            throw new RuntimeException("Seller cannot bid on their own auction");
        }

        Bid bid = new Bid(
                auction,
                bidder,
                request.getAmount(),
                LocalDateTime.now()
        );

        auction.setCurrentHighestBid(request.getAmount());
        auctionItemRepository.save(auction);

        Bid savedBid = bidRepository.save(bid);
        notificationService.notifyNewBid(savedBid);

        return convertToDto(savedBid);
    }

    public Page<BidDto> getAuctionBids(Long auctionId, int page, int size) {
        return bidRepository.findByAuctionItemIdOrderByAmountDesc(
                auctionId,
                PageRequest.of(page, size)
        ).map(this::convertToDto);
    }
    public Page<BidDto> getCurrentUserHighestBids(int page, int size) {
        // Get the current user
        User currentUser = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch the highest bids per auction item placed by the current user
        List<Bid> highestBids = bidRepository.findHighestBidsByUser(currentUser);

        // Paginate the results manually
        int start = Math.min(page * size, highestBids.size());
        int end = Math.min(start + size, highestBids.size());
        List<Bid> paginatedBids = highestBids.subList(start, end);

        // Convert the bids to DTOs
        List<BidDto> bidDtos = paginatedBids.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        // Create a Page object from the list
        return new PageImpl<>(bidDtos, PageRequest.of(page, size), highestBids.size());
    }


    public Page<BidDto> getCurrentUserBids(int page, int size) {
        User currentUser = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return bidRepository.findByBidderOrderByBidTimeDesc(
                currentUser,
                PageRequest.of(page, size)
        ).map(this::convertToDto);
    }

    public BidDto getHighestBid(Long auctionId) {
        return bidRepository.findTopByAuctionItemIdOrderByAmountDesc(auctionId)
                .map(this::convertToDto)
                .orElse(null);
    }

    private BidDto convertToDto(Bid bid) {
        return new BidDto(
                bid.getId(),
                bid.getAuctionItem().getId(),
                bid.getBidder().getId(),
                bid.getBidder().getFullName(),
                bid.getAmount(),
                bid.getBidTime(),
                bid.getAuctionItem().getEndTime(),
                bid.getAuctionItem().getTitle()
        );
    }

    public Optional<Bid> findById(Long id) {
        return bidRepository.findById(id);
    }
}
