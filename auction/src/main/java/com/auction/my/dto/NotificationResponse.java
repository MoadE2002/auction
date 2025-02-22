package com.auction.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private String message;
    private LocalDateTime timestamp;
    private Boolean isRead;
    private String notificationType;
    private Long referenceId;
}