package com.auction.my.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
public class UpdateUserRequest {
    private String username;
    private String email;
    private String phone;
    private String image;
    private String gender;
    private String age;
    private String address;
    private String city;
    private String country;
    private String businessName;

    public UpdateUserRequest(String username, String email, String phone, String image, String gender, String age, String address, String city, String country, String businessName) {
        this.username = username;
        this.email = email;
        this.phone = phone;
        this.image = image;
        this.gender = gender;
        this.age = age;
        this.address = address;
        this.city = city;
        this.country = country;
        this.businessName = businessName;
    }
    public UpdateUserRequest(){ }

    public String getBusinessName() {
        return businessName;
    }

    public String getCountry() {
        return country;
    }

    public String getCity() {
        return city;
    }

    public String getAddress() {
        return address;
    }

    public String getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getImage() {
        return image;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }
}