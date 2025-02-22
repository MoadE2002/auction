package com.auction.my.model;

import com.auction.my.entity.AuctionItem;
import com.auction.my.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

/**
 * Report entity for the Auction System
 * Represents reports related to auction items, users, etc.
 */
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;   // Description of the report

    private Date createdAt;   // Date when the report was created

    private boolean resolved = false;   // Whether the report is resolved or not



    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
