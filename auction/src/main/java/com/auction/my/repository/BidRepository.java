package com.auction.my.repository;

import com.auction.my.entity.Bid;
import com.auction.my.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;


import java.util.List;

@Repository
public interface BidRepository extends JpaRepository<Bid, Long> {

    List<Bid> findByAuctionItemId(Long auctionItemId);

//    Bid findTopByAuctionItemIdOrderByAmountDesc();
//
//    List<Bid> findByUserId(Long userId);
//
//    List<Bid> findByBidTimeBetween(Long startTime, Long endTime);

    Page<Bid> findByAuctionItemIdOrderByAmountDesc(Long auctionItemId, Pageable pageable);

    Page<Bid> findByBidderOrderByBidTimeDesc(User bidder, Pageable pageable);
    @Query("SELECT b FROM Bid b " +
            "WHERE b.bidder = :user AND b.amount = (" +
            "  SELECT MAX(b2.amount) FROM Bid b2 WHERE b2.auctionItem = b.auctionItem AND b2.bidder = :user" +
            ")")
    List<Bid> findHighestBidsByUser(@Param("user") User user);

    Optional<Bid> findTopByAuctionItemIdOrderByAmountDesc(Long auctionItemId);
    Long countByBidder(User bidder);
}
