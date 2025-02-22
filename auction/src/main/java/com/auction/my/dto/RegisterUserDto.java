package com.auction.my.dto;

import lombok.*;

import java.util.Date;


@Builder
public class RegisterUserDto {
    private String username;
    private String email;
    private String gender;
    private String age;
    private String city;
    private String address;

    public RegisterUserDto(String username, String email, String gender, String age, String city, String address, String phone, String password, String businessName, String country) {
        this.username = username;
        this.email = email;
        this.gender = gender;
        this.age = age;
        this.city = city;
        this.address = address;
        this.phone = phone;
        this.password = password;
        this.businessName = businessName;
        this.country = country;
    }

    private String phone;
    private String password;
    private String businessName;
    private String country;


    public String getCountry() {
        return country;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }

    public String getAge() {
        return age;
    }

    public String getGender() {
        return gender;
    }

    public String getEmail() {
        return email;
    }

    public String getUsername() {
        return username;
    }


    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public void setCountry(String country) {
        this.country = country;
    }

}
