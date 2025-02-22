package com.auction.my.controller;
import com.auction.my.dto.*;
import com.auction.my.entity.User;
import com.auction.my.service.AuthenticationService;
import com.auction.my.service.JwtService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")

public class AuthController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    public AuthController(JwtService jwtService, AuthenticationService authenticationService) {
        this.jwtService = jwtService;
        this.authenticationService = authenticationService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody RegisterUserDto registerUserDto) {
        try {
            User user = authenticationService.signup(registerUserDto);
            return ResponseEntity.ok("User registered successfully. Please check your email for verification.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during registration: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody LoginUserDto loginUserDto) {
        try {
            User authenticatedUser = authenticationService.authenticate(loginUserDto);

            // Ensure image is loaded properly
            String userImage = authenticatedUser.getImage();
            if (userImage != null && userImage.length() > 10485760) { // 10MB limit
                authenticatedUser.setImage(null); // or truncate if needed
            }

            Map<String, Object> extraClaims = new HashMap<>();
            extraClaims.put("id", authenticatedUser.getId());
            extraClaims.put("role", authenticatedUser.getRole());
            extraClaims.put("email", authenticatedUser.getEmail());

            String jwtToken = jwtService.generateToken(extraClaims, authenticatedUser);

            ResponseUserDto responseUserDto = new ResponseUserDto(
                    authenticatedUser.getId(),
                    authenticatedUser.getEmail(),
                    authenticatedUser.getFullName(),
                    authenticatedUser.getCity(),
                    authenticatedUser.getAge(),
                    authenticatedUser.getPhone(),
                    authenticatedUser.getAddress(),
                    authenticatedUser.getGender(),
                    authenticatedUser.getRole().name(),
                    authenticatedUser.getImage()
            );

            LoginResponse loginResponse = new LoginResponse(jwtToken, jwtService.getExpirationTime(), responseUserDto);

            return ResponseEntity.ok(loginResponse);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred during login. Please try again later.");
        }
    }


    @PostMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestBody VerifyUserDto verifyUserDto) {
        try {
            authenticationService.verifyUser(verifyUserDto);
            return ResponseEntity.ok("User verified successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Verification failed: " + e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerificationCode(@RequestParam String email) {
        try {
            authenticationService.resendVerificationCode(email);
            return ResponseEntity.ok("Verification code resent successfully.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending verification code: " + e.getMessage());
        }
    }

}
