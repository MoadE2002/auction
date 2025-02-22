package com.auction.my.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonPropertyOrder({"username", "email" , "username" , "city" , "age" , "phone" , "address" , "gender" , "role" , "image"} )
public class ResponseUserDto {
    @JsonProperty("id")
    private Long id;
    @JsonProperty("email")
    private String email;
    @JsonProperty("username")
    private String username;
    @JsonProperty("city")
    private String city;
    @JsonProperty("age")
    private String age;
    @JsonProperty("phone")
    private String phone;
    @JsonProperty("address")
    private String address;
    @JsonProperty("gender")
    private String gender;
    @JsonProperty("role")
    private String role;
    @JsonProperty("image")
    private  String image ;
    public ResponseUserDto() {

    }
    public ResponseUserDto(Long id,String email, String username, String city, String age, String phone, String address, String gender, String role , String image ) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.city = city;
        this.age = age;
        this.phone = phone;
        this.address = address;
        this.gender = gender;
        this.role = role;
        this.image = image ;


    }
}
