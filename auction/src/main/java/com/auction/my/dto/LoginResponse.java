package com.auction.my.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private long expirationTime;
    private String username;
    private String email;
    private String city;
    private String age;
    private String phone;
    private String address;
    private String gender;
    private String role;
    private String photoDeProfile;
    private Long _id;


    public LoginResponse(String token, long expirationTime, ResponseUserDto user) {
        this.token = token;
        this.expirationTime = expirationTime;
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.city = user.getCity();
        this.age = user.getAge();
        this.phone = user.getPhone();
        this.address = user.getAddress();
        this.gender = user.getGender();
        this.role = user.getRole();
        this.photoDeProfile = user.getImage();
        this._id = user.getId();
    }

    // Getters and Setters for all fields
}
