package com.auction.my.dto;

import lombok.*;


@Setter
@Getter
@NoArgsConstructor
public class VerifyUserDto {
    private String verificationToken;

    public VerifyUserDto(String verificationToken) {
        this.verificationToken = verificationToken;
    }

}
