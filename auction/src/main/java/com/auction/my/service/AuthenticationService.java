package com.auction.my.service;

import com.auction.my.dto.LoginUserDto;
import com.auction.my.dto.RegisterUserDto;
import com.auction.my.dto.VerifyUserDto;
import com.auction.my.entity.User;
import com.auction.my.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationService(
            UserRepository userRepository,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder,
           EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Transactional
    public User signup(RegisterUserDto input) {
        // Validate email
        Optional<User> existingUserEmail = userRepository.findByEmail(input.getEmail());
        if (existingUserEmail.isPresent()) {
            throw new IllegalStateException("Email already taken");
        }



        // Basic validation
        if (input.getPassword() == null || input.getPassword().trim().isEmpty()) {
            throw new IllegalStateException("Password cannot be empty");
        }
        if (input.getUsername() == null || input.getUsername().trim().isEmpty()) {
            throw new IllegalStateException("Username cannot be empty");
        }
        if (input.getEmail() == null || input.getEmail().trim().isEmpty()) {
            throw new IllegalStateException("Email cannot be empty");
        }

        String encodedPassword = passwordEncoder.encode(input.getPassword());

        User user = new User(
                input.getUsername(),
                input.getEmail(),
                input.getGender(),
                input.getAge(),
                input.getAddress(),
                input.getPhone(),
                encodedPassword,
                input.getBusinessName(),
                input.getCity(),
                input.getCountry(),
                false,
                generateVerificationCode(),
                LocalDateTime.now().plusHours(1),
                User.Role.CLIENT
        );


        userRepository.save(user);
        sendVerificationEmail(user);
        return user;
    }

    public User authenticate(LoginUserDto loginRequest) {
        try {
            Optional<User> userByemail = userRepository.findByEmail(loginRequest.getEmail());

            if (userByemail.isEmpty()) {
                throw new IllegalStateException("Invalid email or password");
            }

            User user = userByemail.get();

            if (!user.getEmailVerified()) {
                String newToken = generateVerificationCode();
                user.setVerificationToken(newToken);
                user.setTokenExpirationDate(LocalDateTime.now().plusHours(1));
                userRepository.save(user);
                sendVerificationEmail(user);
                throw new IllegalStateException("Email not verified. A new verification code has been sent to your email.");
            }

            try {
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                loginRequest.getPassword()
                        )
                );
            } catch (Exception e) {
                throw new IllegalStateException("Invalid email or password");
            }

            return user;
        } catch (Exception e) {
            if (e instanceof IllegalStateException) {
                throw e;
            }
            throw new IllegalStateException("An error occurred during authentication: " + e.getMessage());
        }
    }

    @Transactional
    public void verifyUser(VerifyUserDto input) {
        if (input.getVerificationToken() == null || input.getVerificationToken().trim().isEmpty()) {
            throw new IllegalStateException("Verification token cannot be empty");
        }

        User user = userRepository.findByVerificationToken(input.getVerificationToken())
                .orElseThrow(() -> new IllegalStateException("Invalid verification token"));

        if (user.getTokenExpirationDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Verification token has expired");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpirationDate(null);
        userRepository.save(user);
    }

    public void resendVerificationCode(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalStateException("Email cannot be empty");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        if (user.getEmailVerified()) {
            throw new IllegalStateException("Email is already verified");
        }

        String newToken = generateVerificationCode();
        user.setVerificationToken(newToken);
        user.setTokenExpirationDate(LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        sendVerificationEmail(user);
    }

    private void sendVerificationEmail(User user) {
        String verificationLink = "http://localhost:3000/user/verify/" + user.getVerificationToken();
        try {
            emailService.sendEmail(
                    user.getEmail(),
                    "Email Verification",
                    "Please verify your email by entering this code: " + user.getVerificationToken() +
                            "\nOr click this link: " + verificationLink
            );
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send verification email", e);
        }
    }

    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
}