package com.auction.my.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

// DTO for creating a new report
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReportRequestDTO {
    @NotBlank(message = "Content cannot be empty")
    @Size(min = 10, max = 1000, message = "Content must be between 10 and 1000 characters")
    private String content;

    @NotNull(message = "User ID is required")
    private Long userId;
}

