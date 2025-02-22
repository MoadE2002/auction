package com.auction.my.service;

import com.auction.my.dto.ChangePasswordRequest;
import com.auction.my.dto.UpdateUserRequest;
import com.auction.my.dto.UserDto;
import com.auction.my.entity.AuctionItem;
import com.auction.my.entity.User;
import com.auction.my.repository.AuctionItemRepository;
import com.auction.my.repository.BidRepository;
import com.auction.my.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuctionItemRepository auctionItemRepository;
    private final BidRepository bidRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuctionItemRepository auctionItemRepository, BidRepository bidRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.auctionItemRepository = auctionItemRepository;
        this.bidRepository = bidRepository;
    }

    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return convertToDto(user);
    }

    public UserDto updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        validateUserUpdate(user);

        if (request.getEmail() != null) {
            validateEmailUnique(request.getEmail(), user.getId());
            user.setEmail(request.getEmail());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getImage() != null) {
            user.setImage(request.getImage());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getAge() != null) {
            user.setAge(request.getAge());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry());
        }
        if (request.getBusinessName() != null) {
            user.setBusinessName(request.getBusinessName());
        }

        return convertToDto(userRepository.save(user));
    }

    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        validateUserDelete(user);
        userRepository.delete(user);
    }

    public UserDto getCurrentUser() {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(Long.parseLong(currentUsername))
                .orElseThrow(() -> new RuntimeException("Current user not found"));
        return convertToDto(user);
    }

    public Map<String, Object> getUserStatistics(Long userId) {
        Map<String, Object> statistics = new HashMap<>();

        // Fetch user from the database
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        // Get the unsold items count (isSold = false)
        Long unsoldItemsCount = auctionItemRepository.countBySellerAndIsSoldFalse(user);

        // Get the total auction items created by the user
        Long totalItemsCreated = auctionItemRepository.countBySeller(user);

        // Get the total bids made by the user
        Long totalBids = bidRepository.countByBidder(user);

        // Get monthly revenue for the user
        Map<String, Double> monthlyRevenue = getMonthlyRevenue(user);

        // Get total items created per month by the user
        Map<String, Long> itemsCreatedByMonth = getItemsCreatedByMonth(user);

        statistics.put("unsoldItemsCount", unsoldItemsCount);
        statistics.put("totalItemsCreated", totalItemsCreated);
        statistics.put("totalBids", totalBids);
        statistics.put("monthlyRevenue", monthlyRevenue);
        statistics.put("itemsCreatedByMonth", itemsCreatedByMonth);

        return statistics;
    }

    private Map<String, Long> getItemsCreatedByMonth(User user) {
        // Assuming auctionItemRepository has a method to fetch count of items by month
        List<Object[]> itemsCreatedData = auctionItemRepository.countItemsCreatedByMonth(user);

        Map<String, Long> itemsCreatedByMonth = new HashMap<>();

        // Loop over the result and populate the map
        for (Object[] record : itemsCreatedData) {
            int month = (Integer) record[0];  // Month number (1-12)
            long count = (Long) record[1];    // Count of items created in that month
            itemsCreatedByMonth.put("Month " + month, count);
        }

        // Ensure all months (1-12) are represented in the map, even with zero items
        for (int i = 1; i <= 12; i++) {
            itemsCreatedByMonth.putIfAbsent("Month " + i, 0L);
        }

        return itemsCreatedByMonth;
    }


    // Method to get the monthly revenue for a user
    public Map<String, Double> getMonthlyRevenue(User user) {
        // Initialize the revenue map with all months set to 0.0
        Map<String, Double> revenueMap = new HashMap<>();
        for (int i = 1; i <= 12; i++) {
            revenueMap.put(String.valueOf(i), 0.0);
        }

        // Get all sold items for the user
        List<AuctionItem> soldItems = auctionItemRepository.findBySellerAndIsSoldTrue(user);

        // Calculate the revenue for each sold item
        for (AuctionItem item : soldItems) {
            LocalDateTime creationDate = item.getStartTime();
            int month = creationDate.getMonthValue();
            double revenue = item.getCurrentHighestBid() * 0.95;

            // Add the revenue to the respective month
            String monthKey = String.valueOf(month);
            revenueMap.put(monthKey, revenueMap.get(monthKey) + revenue);
        }

        return revenueMap;
    }


    public void changePassword(ChangePasswordRequest request) {
        User user = userRepository.findById(getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify old password
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        // Update to new password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public Page<UserDto> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size))
                .map(this::convertToDto);
    }

    public UserDto blockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        validateAdminOperation();
        user.setEmailVerified(false);  // Using emailVerified as a blocking mechanism
        return convertToDto(userRepository.save(user));
    }

    public UserDto unblockUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        validateAdminOperation();
        user.setEmailVerified(true);
        return convertToDto(userRepository.save(user));
    }

    private UserDto convertToDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setUsername(user.getFullName());
        dto.setPhone(user.getPhone());
        dto.setRole(user.getRole().name());
        dto.setImage(user.getImage());

        // Map the new fields
        dto.setGender(user.getGender());
        dto.setAge(user.getAge());
        dto.setAddress(user.getAddress());
        dto.setCity(user.getCity());
        dto.setCountry(user.getCountry());
        dto.setBusinessName(user.getBusinessName());

        return dto;
    }


    private void validateUserUpdate(User user) {
        User currentUser = userRepository.findById(getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (!user.getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Not authorized to update this user");
        }
    }

    private void validateUserDelete(User user) {
        User currentUser = userRepository.findById(getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (!user.getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Not authorized to delete this user");
        }
    }

    private void validateAdminOperation() {
        User currentUser = userRepository.findById(getCurrentUser().getId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));

        if (currentUser.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Operation requires admin privileges");
        }
    }

    private void validateEmailUnique(String email, Long userId) {
        userRepository.findByEmail(email)
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(userId)) {
                        throw new RuntimeException("Email already in use");
                    }
                });
    }

    private void validateUsernameUnique(String username, Long userId) {
        userRepository.findByUsername(username)
                .ifPresent(existingUser -> {
                    if (!existingUser.getId().equals(userId)) {
                        throw new RuntimeException("Username already in use");
                    }
                });
    }
}