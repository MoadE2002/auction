package com.auction.my.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;


import java.time.LocalDateTime;

@Entity
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String message;


    private NotifType type ;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Column(nullable = false)
    private Boolean isRead = false;


    @Builder
    public Notification(Long id, User user, String message, NotifType type, LocalDateTime timestamp, Boolean isRead) {
        this.id = id;
        this.user = user;
        this.message = message;
        this.type = type;
        this.timestamp = timestamp;
        this.isRead = isRead;
    }
    public Notification(){
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public String getMessage() {
        return message;
    }

    public NotifType getType() {
        return type;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Boolean getRead() {
        return isRead;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setType(NotifType type) {
        this.type = type;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }

    public enum NotifType {
        WIN,
        NEW_BID,
        OUTBID,
        SOMEONEBIDYOURITEM,
        AUCTIONENDED,
        NEWITEMLISTED,
        BIDDINGCLOSESOON,
        OUTBIDONYOURITEM,
        DEFAULT,
        AUCTION_END
    }
}
