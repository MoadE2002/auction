package com.auction.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;



public class NotificationDto {
    private Long id;
    private Long userId;
    private String message;
    private String type ;
    private LocalDateTime timestamp;
    private Boolean isRead;

    public NotificationDto(Long id, Long userId, String message, String type, LocalDateTime timestamp, Boolean isRead) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.timestamp = timestamp;
        this.isRead = isRead;
    }

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getMessage() {
        return message;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public Boolean getRead() {
        return isRead;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setRead(Boolean read) {
        isRead = read;
    }
}

