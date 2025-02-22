package com.auction.my.controller;

import com.auction.my.dto.ChangePasswordRequest;
import com.auction.my.dto.UpdateUserRequest;
import com.auction.my.dto.UserDto;
import com.auction.my.exception.UnauthorizedException;
import com.auction.my.service.UserService;
import com.auction.my.service.JwtService;  // Import the service for handling JWT
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    /**
     * Get the current user's details.
     */
    @GetMapping("/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        UserDto userDto = userService.getCurrentUser();
        return ResponseEntity.ok(userDto);
    }

    /**
     * Update user details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request,
            @RequestHeader("Authorization") String authorization) {

        String jwtToken = authorization.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtService.extractUserId(jwtToken));  // Extract the user ID from the JWT token

        if (!userId.equals(id)) {
            throw new UnauthorizedException("You are not authorized to update this user");
        }

        UserDto updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Change the user's password.
     */
    @PostMapping("/change-password")
    public ResponseEntity<Void> changePassword(
            @RequestBody ChangePasswordRequest request,
            @RequestHeader("Authorization") String authorization) {

        String jwtToken = authorization.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtService.extractUserId(jwtToken));  // Extract the user ID from the JWT token

        if (!userId.equals(userService.getCurrentUser().getId())) {
            throw new UnauthorizedException("You are not authorized to change this password");
        }

        userService.changePassword(request);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete a user by ID (admin only).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization) {

        String jwtToken = authorization.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtService.extractUserId(jwtToken));  // Extract the user ID from the JWT token

        // Check if the user is an admin or is deleting their own account
        if (!userId.equals(id) && !userService.getCurrentUser().getRole().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to delete this user");
        }

        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/user-statistics/{userId}")
    public Map<String, Object> getUserStatistics(@PathVariable Long userId,
                                                 @RequestHeader("Authorization") String authorization) {
        String jwtToken = authorization.replace("Bearer ", "");
        Long id = Long.valueOf(jwtService.extractUserId(jwtToken));
        if (!userId.equals(id) && !userService.getCurrentUser().getRole().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to see details about this user");
        }
        return userService.getUserStatistics(userId);
    }



    /**
     * Get all users (admin only).
     */


    @GetMapping
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader("Authorization") String authorization) {

        String jwtToken = authorization.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtService.extractUserId(jwtToken));  // Extract the user ID from the JWT token

        if (!userService.getCurrentUser().getRole().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to view all users");
        }

        Page<UserDto> users = userService.getAllUsers(page, size);
        return ResponseEntity.ok(users);
    }

    /**
     * Block a user (admin only).
     */
    @PostMapping("/{id}/block")
    public ResponseEntity<UserDto> blockUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization) {

        String jwtToken = authorization.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtService.extractUserId(jwtToken));

        if (!userService.getCurrentUser().getRole().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to block this user");
        }

        UserDto blockedUser = userService.blockUser(id);
        return ResponseEntity.ok(blockedUser);
    }

    /**
     * Unblock a user (admin only).
     */
    @PostMapping("/{id}/unblock")
    public ResponseEntity<UserDto> unblockUser(
            @PathVariable Long id,
            @RequestHeader("Authorization") String authorization) {

        String jwtToken = authorization.replace("Bearer ", "");
        Long userId = Long.valueOf(jwtService.extractUserId(jwtToken));  // Extract the user ID from the JWT token

        if (!userService.getCurrentUser().getRole().equals("ADMIN")) {
            throw new UnauthorizedException("You are not authorized to unblock this user");
        }

        UserDto unblockedUser = userService.unblockUser(id);
        return ResponseEntity.ok(unblockedUser);
    }
}
