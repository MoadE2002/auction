package com.auction.my.repository;


import com.auction.my.dto.AuctionSummaryDto;
import com.auction.my.entity.AuctionItem;
import com.auction.my.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface AuctionItemRepository extends JpaRepository<AuctionItem, Long> {

    List<AuctionItem> findBySellerId(Long sellerId);


    List<AuctionItem> findByCategory(String category);

    List<AuctionItem> findByEndTimeBetween(LocalDateTime startTime, LocalDateTime endTime);

    Page<AuctionItem> findBySellerId(Long sellerId, Pageable pageable);
    List<AuctionItem> findAllByEndTimeBeforeAndIsSoldFalse(LocalDateTime endTime);
    Page<AuctionItem> findByEndTimeAfter(LocalDateTime dateTime, Pageable pageable);
    @Modifying
    @Query("UPDATE AuctionItem ai SET ai.views = :views WHERE ai.id = :id")
    void updateViews(@Param("views") Long views, @Param("id") Long id);

    Page<AuctionItem> findByEndTimeAfterAndIsSoldFalse(LocalDateTime now, Pageable pageable);
    @Query("SELECT new com.auction.my.dto.AuctionSummaryDto(a.id, a.title, a.currentHighestBid, a.endTime) " +
            "FROM AuctionItem a WHERE a.isSold = true")
    List<AuctionSummaryDto> findAllByIsSoldTrue();

    long countByIsSoldFalse();
    Long countBySellerAndIsSoldFalse(User seller);
    Long countBySeller(User seller);
    List<AuctionItem> findBySellerAndIsSoldTrue(User seller);
//    @Query("SELECT FUNCTION('MONTH', a.creationDate) AS month, COUNT(a) AS count " +
//            "FROM AuctionItem a " +
//            "GROUP BY FUNCTION('MONTH', a.creationDate)")
//    List<Object[]> findAuctionItemCountByMonth();
@Query("SELECT EXTRACT(MONTH FROM ai.startTime) AS month, COUNT(ai.id) FROM AuctionItem ai GROUP BY EXTRACT(MONTH FROM ai.startTime)")
List<Object[]> findAuctionItemsByMonth();
    @Query("SELECT EXTRACT(MONTH FROM ai.startTime) AS month, COUNT(ai) AS count " +
            "FROM AuctionItem ai WHERE ai.seller = :user " +
            "GROUP BY EXTRACT(MONTH FROM ai.startTime)")
    List<Object[]> countItemsCreatedByMonth(@Param("user") User user);


    @Query("SELECT a FROM AuctionItem a WHERE " +
            "(LOWER(a.title) LIKE LOWER(CONCAT('%', :title, '%')) OR :title IS NULL) AND " +
            "(LOWER(a.category) LIKE LOWER(CONCAT('%', :category, '%')) OR :category IS NULL) AND " +
            "(LOWER(a.brand) LIKE LOWER(CONCAT('%', :brand, '%')) OR :brand IS NULL) AND " +
            "(a.startingPrice >= :minPrice OR :minPrice IS NULL) AND " +
            "(a.startingPrice <= :maxPrice OR :maxPrice IS NULL)")
    Page<AuctionItem> findAllByCriteria(@Param("title") String title,
                                        @Param("category") String category,
                                        @Param("brand") String brand,
                                        @Param("minPrice") Double minPrice,
                                        @Param("maxPrice") Double maxPrice,
                                        PageRequest pageRequest);
}
