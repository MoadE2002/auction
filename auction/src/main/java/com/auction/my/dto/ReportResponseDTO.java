package com.auction.my.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class ReportResponseDTO {
    // Add getters and setters
    private Long id;
    private String content;
    private Date createdAt;
    private boolean resolved;
    private Long userId;
    private String userEmail;


    public void setId(Long id) { this.id = id; }

    public void setContent(String content) { this.content = content; }

    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public void setResolved(boolean resolved) { this.resolved = resolved; }

    public void setUserId(Long userId) { this.userId = userId; }

    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
}
