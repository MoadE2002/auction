package com.auction.my.entity;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Set;

@Entity
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    private String gender;

    private String age;


    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String businessName;

    private String country;
    private String address;

    private String city;

    public String getFullName(){
        return this.username;
    }

    @Column(nullable = false)
    private Boolean isEmailVerified = false;

    private String verificationToken;

    private LocalDateTime tokenExpirationDate;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<AuctionItem> auctionItems;

    @OneToMany(mappedBy = "bidder", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Bid> bids;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Notification> notifications;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String image;

    // You may keep the other constructor with arguments
    public User(String username, String email, String gender, String age, String address, String phone,
                String password, String businessName, String city, String country,
                boolean isEmailVerified, String verificationToken, LocalDateTime tokenExpirationDate, User.Role role) {
        this.username = username;
        this.email = email;
        this.gender = gender;
        this.age = age;
        this.address = address;
        this.phone = phone;
        this.password = password;
        this.businessName = businessName;
        this.city = city;
        this.country = country;
        this.isEmailVerified = isEmailVerified;
        this.verificationToken = verificationToken;
        this.tokenExpirationDate = tokenExpirationDate;
        this.role = role;
    }
    public User() {
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + this.role));
        System.out.println("Assigned authorities: " + authorities);
        return authorities;
    }



    public void setPassword(String password) {
        this.password = password;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setCity(String city) {
        this.city = city;
    }


    public void setEmailVerified(Boolean emailVerified) {
        isEmailVerified = emailVerified;
    }

    public void setVerificationToken(String verificationToken) {
        this.verificationToken = verificationToken;
    }

    public void setTokenExpirationDate(LocalDateTime tokenExpirationDate) {
        this.tokenExpirationDate = tokenExpirationDate;
    }

    public void setAuctionItems(Set<AuctionItem> auctionItems) {
        this.auctionItems = auctionItems;
    }

    public void setBids(Set<Bid> bids) {
        this.bids = bids;
    }

    public void setNotifications(Set<Notification> notifications) {
        this.notifications = notifications;
    }

    public void setImage(String image) {
        this.image = image;
    }

    @Override
    public boolean isAccountNonExpired() {
        return UserDetails.super.isAccountNonExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return UserDetails.super.isAccountNonLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return UserDetails.super.isCredentialsNonExpired();
    }

    @Override
    public boolean isEnabled() {
        return UserDetails.super.isEnabled();
    }
    @Override
    public String getUsername(){
        return this.id.toString() ;
    }
    @Override
    public String getPassword() {
        return this.password;
    }

    public Long getId() {
        return id;
    }

    public String getGender() {
        return gender;
    }

    public String getEmail() {
        return email;
    }

    public String getAge() {
        return age;
    }

    public String getPhone() {
        return phone;
    }

    public Role getRole() {
        return role;
    }

    public String getBusinessName() {
        return businessName;
    }

    public String getCountry() {
        return country;
    }

    public String getAddress() {
        return address;
    }

    public String getCity() {
        return city;
    }
    public Boolean getEmailVerified() {
        return isEmailVerified;
    }

    public String getVerificationToken() {
        return verificationToken;
    }

    public LocalDateTime getTokenExpirationDate() {
        return tokenExpirationDate;
    }

    public Set<AuctionItem> getAuctionItems() {
        return auctionItems;
    }

    public Set<Bid> getBids() {
        return bids;
    }

    public Set<Notification> getNotifications() {
        return notifications;
    }

    public String getImage() {
        return image;
    }
    public enum Role {
        ADMIN, CLIENT
    }

}

