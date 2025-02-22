package com.auction.my.dto;

import lombok.*;


@Setter
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class UserDto {
    // Getters and Setters
    private Long id;
    private String email;
    private String username;
    private String phone;
    private String image;
    private String gender;
    private String age;
    private String address;
    private String city;
    private String country;
    private String businessName;
    private String role;


}
