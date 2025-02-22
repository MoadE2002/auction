package com.auction.my.service;

import com.auction.my.dto.UserDto;
import com.auction.my.entity.User;
import com.auction.my.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Method to get all users (paged)
    public Page<UserDto> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size))
                .map(this::convertToDto);
    }

    // Method to block a user (admin only)
    public UserDto blockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure the current user is an admin before proceeding
        validateAdminPrivileges();

        user.setEmailVerified(false); // Block the user
        return convertToDto(userRepository.save(user));
    }

    // Method to unblock a user (admin only)
    public UserDto unblockUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure the current user is an admin before proceeding
        validateAdminPrivileges();

        user.setEmailVerified(true); // Unblock the user
        return convertToDto(userRepository.save(user));
    }

    // Helper method to convert User entity to UserDto
    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getUsername());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name());
        dto.setImage(user.getImage());

        dto.setGender(user.getGender());
        dto.setAge(user.getAge());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setCountry(user.getCountry());
        dto.setBusinessName(user.getBusinessName());

        return dto;
    }


    // Validate if the current user is an admin
    public void validateAdminPrivileges() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Only admins can perform this operation");
        }
    }
}
