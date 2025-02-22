package com.auction.my.controller;

import com.auction.my.dto.UserDto;
import com.auction.my.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Get all users (paged) - Accessible only to admins
    @GetMapping("/users")
    public ResponseEntity<Page<UserDto>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        // Only admins can retrieve all users
        adminService.validateAdminPrivileges();  // Admin check
        Page<UserDto> users = adminService.getAllUsers(page, size);
        return ResponseEntity.ok(users);
    }

    // Block a user - Accessible only to admins
    @PostMapping("/users/{userId}/block")
    public ResponseEntity<UserDto> blockUser(@PathVariable Long userId) {
        adminService.validateAdminPrivileges();  // Admin check
        UserDto blockedUser = adminService.blockUser(userId);
        return ResponseEntity.ok(blockedUser);
    }

    // Unblock a user - Accessible only to admins
    @PostMapping("/users/{userId}/unblock")
    public ResponseEntity<UserDto> unblockUser(@PathVariable Long userId) {
        adminService.validateAdminPrivileges();  // Admin check
        UserDto unblockedUser = adminService.unblockUser(userId);
        return ResponseEntity.ok(unblockedUser);
    }
}

