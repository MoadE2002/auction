package com.auction.my.config;

import com.auction.my.entity.User;
import com.auction.my.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if an admin user already exists
            if (userRepository.findByUsername("admin").isEmpty()) {
                User admin = new User(
                        "admin",                                // Username
                        "admin@example.com",                   // Email
                        "Male",                                // Gender
                        "30",                                  // Age
                        "123 Admin Street",                    // Address
                        "+123456789",                          // Phone
                        passwordEncoder.encode("admin123"),    // Password (hashed)
                        "Admin Business",                      // Business Name
                        "Admin City",                          // City
                        "Admin Country",                       // Country
                        true,                                  // isEmailVerified
                        null,                                  // verificationToken
                        null,                                  // tokenExpirationDate
                        User.Role.ADMIN                        // Role
                );
                userRepository.save(admin);
                System.out.println("Default admin user created.");
            } else {
                System.out.println("Admin user already exists.");
            }
        };
    }
}
