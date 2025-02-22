package com.auction.my.service;

import com.auction.my.dto.NotificationDto;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final ObjectMapper objectMapper;

    public WebSocketService(SimpMessagingTemplate messagingTemplate, ObjectMapper objectMapper) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = objectMapper;
    }

    public void sendNotification(Long userId, NotificationDto notificationDto) {
        try {
            String destination = "/topic/notifications/" + userId;
            String payload = objectMapper.writeValueAsString(notificationDto);
            messagingTemplate.convertAndSend(destination, payload);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize notification data", e);
        }
    }
}
