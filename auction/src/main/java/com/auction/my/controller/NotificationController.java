package com.auction.my.controller;

/**
 * @author Moad
 **/

import com.auction.my.dto.NotificationDto;
import com.auction.my.entity.Bid;
import com.auction.my.service.BidService;
import com.auction.my.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final BidService bidService;

    public NotificationController(NotificationService notificationService, BidService bidService) {
        this.notificationService = notificationService;
        this.bidService = bidService;
    }

    /**
     * Get all notifications for the current user, with pagination.
     */
    @GetMapping
    public ResponseEntity<Page<NotificationDto>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NotificationDto> notifications = notificationService.getUserNotifications(page, size);
        return ResponseEntity.ok(notifications);
    }
    @PostMapping("/outbid/{bidId}")
    public void notifyOutbid(@PathVariable Long bidId) {
        // Fetch the bid using the bidId (ensure the bid exists)
        Bid bid = bidService.findById(bidId)
                .orElseThrow(() -> new RuntimeException("Bid not found"));

        // Notify the last max bidder that their bid has been outbid
        notificationService.notifyLastMaxBidderOutbid(bid);
    }
    /**
     * Get unread notifications for the current user, with pagination.
     */
    @GetMapping("/unread")
    public ResponseEntity<Page<NotificationDto>> getUnreadNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<NotificationDto> unreadNotifications = notificationService.getUnreadNotifications(page, size);
        return ResponseEntity.ok(unreadNotifications);
    }

    /**
     * Mark a specific notification as read.
     */
    @PostMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markAsRead(@PathVariable Long id) {
        NotificationDto notification = notificationService.markAsRead(id);
        return ResponseEntity.ok(notification);
    }

    /**
     * Mark all notifications as read for the current user.
     */
    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        notificationService.markAllAsRead();
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete a specific notification by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
        return ResponseEntity.noContent().build();
    }
}

