package com.auction.my.service;

import com.auction.my.dto.NotificationDto;
import com.auction.my.entity.AuctionItem;
import com.auction.my.entity.Bid;
import com.auction.my.entity.Notification;
import com.auction.my.entity.User;
import com.auction.my.repository.NotificationRepository;
import com.auction.my.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final WebSocketService webSocketService;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository,
                               UserService userService, WebSocketService webSocketService) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.webSocketService = webSocketService;
    }

    public void createNotification(String message, Long userId, Notification.NotifType type) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification(
                null,
                user,
                message,
                type,
                LocalDateTime.now(),
                false
        );

        Notification savedNotification = notificationRepository.save(notification);
        NotificationDto dto = convertToDto(savedNotification);

        // Push the notification via WebSocket
        webSocketService.sendNotification(userId, dto);

    }



    public Page<NotificationDto> getUserNotifications(int page, int size) {
        User currentUser = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserOrderByTimestampDesc(
                currentUser,
                PageRequest.of(page, size)
        ).map(this::convertToDto);
    }

    public Page<NotificationDto> getUnreadNotifications(int page, int size) {
        User currentUser = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return notificationRepository.findByUserAndIsReadFalseOrderByTimestampDesc(
                currentUser,
                PageRequest.of(page, size)
        ).map(this::convertToDto);
    }

    public NotificationDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        validateNotificationOwnership(notification);
        notification.setRead(true);
        return convertToDto(notificationRepository.save(notification));
    }

    public void markAllAsRead() {
        User currentUser = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        notificationRepository.markAllAsRead(currentUser.getId());
    }

    public void deleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        validateNotificationOwnership(notification);
        notificationRepository.delete(notification);
    }

    public void notifyNewBid(Bid bid) {
        // Notify the auction seller
        String sellerMessage = String.format(
                "New bid of $%.2f placed on your auction '%s'",
                bid.getAmount(),
                bid.getAuctionItem().getTitle()
        );
        createNotification(sellerMessage, bid.getAuctionItem().getSeller().getId(),
                Notification.NotifType.SOMEONEBIDYOURITEM);

        // Notify previous highest bidder if exists
        bid.getAuctionItem().getBids().stream()
                .filter(b -> !b.getId().equals(bid.getId()))
                .max((b1, b2) -> b1.getAmount().compareTo(b2.getAmount()))
                .ifPresent(previousBid -> {
                    String outbidMessage = String.format(
                            "You have been outbid on '%s'. New bid: $%.2f",
                            bid.getAuctionItem().getTitle(),
                            bid.getAmount()
                    );
                    createNotification(outbidMessage, previousBid.getBidder().getId(),
                            Notification.NotifType.OUTBID);
                });
    }

    public void notifyAuctionClosed(AuctionItem auctionItem) {
        // Notify the seller
        String sellerMessage = String.format(
                "Your auction '%s' has ended",
                auctionItem.getTitle()
        );
        createNotification(sellerMessage, auctionItem.getSeller().getId(),
                Notification.NotifType.AUCTION_END);

        // Notify the winner if exists
        auctionItem.getBids().stream()
                .max((b1, b2) -> b1.getAmount().compareTo(b2.getAmount()))
                .ifPresent(winningBid -> {
                    String winnerMessage = String.format(
                            "Congratulations! You won the auction '%s' with a bid of $%.2f",
                            auctionItem.getTitle(),
                            winningBid.getAmount()
                    );
                    createNotification(winnerMessage, winningBid.getBidder().getId(),
                            Notification.NotifType.WIN);
                });

        // Notify other bidders
        auctionItem.getBids().stream()
                .map(Bid::getBidder)
                .distinct()
                .filter(bidder -> !bidder.equals(auctionItem.getBids().stream()
                        .max((b1, b2) -> b1.getAmount().compareTo(b2.getAmount()))
                        .map(Bid::getBidder)
                        .orElse(null)))
                .forEach(bidder -> {
                    String message = String.format(
                            "Auction '%s' has ended. Thank you for participating",
                            auctionItem.getTitle()
                    );
                    createNotification(message, bidder.getId(), Notification.NotifType.AUCTIONENDED);
                });
    }
    public void notifyLastMaxBidderOutbid(Bid newBid) {
        // Get the auction item associated with the bid
        AuctionItem auctionItem = newBid.getAuctionItem();

        // Get the previous max bid (the highest bid before the new one)
        Bid currentMaxBid = auctionItem.getBids().stream()
                .filter(bid -> !bid.getId().equals(newBid.getId())) // Exclude the new bid
                .max((b1, b2) -> b1.getAmount().compareTo(b2.getAmount())) // Find the max bid
                .orElse(null);

        // If there is no previous max bid (e.g., if this is the first bid), return early
        if (currentMaxBid == null) {
            return;
        }

        // Notify the last max bidder that they have been outbid
        String outbidMessage = String.format(
                "You have been outbid on '%s'. New bid: $%.2f",
                auctionItem.getTitle(),
                newBid.getAmount()
        );
        createNotification(outbidMessage, currentMaxBid.getBidder().getId(),
                Notification.NotifType.OUTBID);
    }

    private void validateNotificationOwnership(Notification notification) {
        User currentUser = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Not authorized to modify this notification");
        }
    }

    private NotificationDto convertToDto(Notification notification) {
        return new NotificationDto(
                notification.getId(),
                notification.getUser().getId(),
                notification.getMessage(),
                notification.getType().name(),
                notification.getTimestamp(),
                notification.getRead()
        );
    }
}