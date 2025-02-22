package com.auction.my.service;

import com.auction.my.dto.AuctionItemDto;
import com.auction.my.dto.AuctionItemDtoWithoutImages;
import com.auction.my.dto.CreateAuctionRequest;
import com.auction.my.dto.UpdateAuctionRequest;
import com.auction.my.entity.AuctionImage;
import com.auction.my.entity.AuctionItem;
import com.auction.my.entity.Bid;
import com.auction.my.entity.User;
import com.auction.my.exception.AuctionNotFoundException;
import com.auction.my.exception.UnauthorizedException;
import com.auction.my.exception.ValidationException;
import com.auction.my.repository.AuctionItemRepository;
import com.auction.my.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuctionService {
    private final AuctionItemRepository auctionItemRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    public AuctionService(
            AuctionItemRepository auctionItemRepository,
            UserRepository userRepository,
            UserService userService,
            NotificationService notificationService
    ) {
        this.auctionItemRepository = auctionItemRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.notificationService = notificationService;
    }

    public AuctionItemDto createAuction(CreateAuctionRequest request) {
        validateCreateAuctionRequest(request);

        User seller = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        validateAuctionTiming(request.getStartTime(), request.getEndTime());

        AuctionItem auction = new AuctionItem();
        auction.setTitle(request.getTitle());
        auction.setDescription(request.getDescription());
        auction.setStartingPrice(request.getStartingPrice());
        auction.setStartTime(request.getStartTime());
        auction.setEndTime(request.getEndTime());
        auction.setSeller(seller);
        auction.setBrand(request.getBrand());
        auction.setCategory(request.getCategory());
        auction.setCurrentHighestBid(request.getStartingPrice());
        auction.setIsSold(false);
        // Validate and process front image
        if (request.getFrontImage() == null || !isValidBase64(request.getFrontImage())) {
            throw new ValidationException("Front image is required and must be a valid Base64 encoded string");
        }
        try {
            byte[] frontImageBytes = Base64.getDecoder().decode(stripBase64Prefix(request.getFrontImage()));
            auction.setFrontImage(frontImageBytes);
        } catch (IllegalArgumentException e) {
            throw new ValidationException("Invalid front image format. Must be Base64 encoded");
        }

        // Handle additional images if present
        if (request.getAdditionalImages() != null && !request.getAdditionalImages().isEmpty()) {
            Set<AuctionImage> additionalImages = request.getAdditionalImages().stream()
                    .map(base64String -> {
                        if (!isValidBase64(base64String)) {
                            throw new ValidationException("Each additional image must be a valid Base64 encoded string");
                        }
                        try {
                            byte[] imageBytes = Base64.getDecoder().decode(stripBase64Prefix(base64String));
                            AuctionImage auctionImage = new AuctionImage();
                            auctionImage.setImage(imageBytes);
                            auctionImage.setAuctionItem(auction);
                            return auctionImage;
                        } catch (IllegalArgumentException e) {
                            throw new ValidationException("Invalid additional image format. Must be Base64 encoded");
                        }
                    })
                    .collect(Collectors.toSet());
            auction.setAdditionalImages(additionalImages);
        }

        return convertToDto(auctionItemRepository.save(auction));
    }

    private String stripBase64Prefix(String base64String) {
        if (base64String != null && base64String.contains(",")) {
            return base64String.split(",")[1];
        }
        return base64String;
    }

    private boolean isValidBase64(String base64String) {
        if (base64String == null) {
            return false;
        }
        try {
            String cleanBase64 = stripBase64Prefix(base64String);
            Base64.getDecoder().decode(cleanBase64);
            return true;
        } catch (IllegalArgumentException e) {
            return false;
        }
    }

    public AuctionItemDto getAuctionById(Long id) {
        return convertToDto(findAuctionById(id));
    }

    public void updateViews(Long views, Long id){
         auctionItemRepository.updateViews(views, id);
    }

    public Page<AuctionItemDtoWithoutImages> getAllAuctions(int page, int size) {
        validatePaginationParameters(page, size);

        PageRequest pageRequest = createPageRequest(page, size);
        return auctionItemRepository.findAll(pageRequest).map(this::convertToDtoWithoutImages);
    }
    private AuctionItemDtoWithoutImages convertToDtoWithoutImages(AuctionItem auctionItem) {
        Bid highestBid = auctionItem.getBids() != null && !auctionItem.getBids().isEmpty() ?
                auctionItem.getBids().stream()
                        .max((b1, b2) -> b1.getAmount().compareTo(b2.getAmount()))
                        .orElse(null) : null;
        return new AuctionItemDtoWithoutImages(
                auctionItem.getId(),
                auctionItem.getTitle(),
                auctionItem.getDescription(),
                auctionItem.getStartingPrice(),
                auctionItem.getCurrentHighestBid(),
                auctionItem.getStartTime(),
                auctionItem.getEndTime(),
                auctionItem.getSeller().getId(),
                auctionItem.getSeller().getUsername(),
                highestBid != null ? highestBid.getId() : null,
                highestBid != null ? highestBid.getBidder().getFullName() : null,
                auctionItem.getCategory(),
                auctionItem.getBrand(),
                auctionItem.getViews()
        );
    }


    public Page<AuctionItemDto> getAuctionsByFilters(
            String title, String category, String brand, Double minPrice, Double maxPrice, int page, int size) {

        // Create a PageRequest for pagination
        PageRequest pageRequest = PageRequest.of(page, size);

        // Query the repository using the search parameters
        return auctionItemRepository.findAllByCriteria(title, category, brand, minPrice, maxPrice, pageRequest)
                .map(this::convertToDto);
    }

    public AuctionItemDto updateAuction(Long id, UpdateAuctionRequest request) {
        validateUpdateAuctionRequest(request);

        AuctionItem auction = findAuctionById(id);
        validateAuctionOwnership(auction);

        if (!auction.getBids().isEmpty()) {
            throw new ValidationException("Cannot update auction after bids have been placed");
        }

        updateAuctionFields(auction, request);
        return convertToDto(auctionItemRepository.save(auction));
    }

    public void deleteAuction(Long id) {
        AuctionItem auction = findAuctionById(id);
        validateAuctionOwnership(auction);

        if (!auction.getBids().isEmpty()) {
            throw new ValidationException("Cannot delete auction after bids have been placed");
        }

        auctionItemRepository.delete(auction);
    }

    public Page<AuctionItemDto> getActiveAuctions(int page, int size) {
        validatePaginationParameters(page, size);

        return auctionItemRepository.findByEndTimeAfter(
                LocalDateTime.now(),
                PageRequest.of(page, size)
        ).map(this::convertToDto);
    }

    public Page<AuctionItemDto> getUserAuctions(Long userId, int page, int size) {
        validatePaginationParameters(page, size);

        return auctionItemRepository.findBySellerId(
                userId,
                PageRequest.of(page, size)
        ).map(this::convertToDto);
    }

    public AuctionItemDto closeAuction(Long id) {
        AuctionItem auction = findAuctionById(id);
        validateAuctionOwnership(auction);

        auction.setEndTime(LocalDateTime.now());
        AuctionItem savedAuction = auctionItemRepository.save(auction);
        notificationService.notifyAuctionClosed(savedAuction);

        return convertToDto(savedAuction);
    }

    private AuctionItem findAuctionById(Long id) {
        return auctionItemRepository.findById(id)
                .orElseThrow(() -> new AuctionNotFoundException("Auction not found with id: " + id));
    }

    @Scheduled(fixedRate = 60000) // Runs every minute
    public void closeExpiredAuctions() {
        LocalDateTime now = LocalDateTime.now();
        List<AuctionItem> expiredAuctions = auctionItemRepository.findAllByEndTimeBeforeAndIsSoldFalse(now);

        for (AuctionItem auction : expiredAuctions) {
            auction.setEndTime(now);
            auction.setSold(true); // Mark as sold or process further
            auctionItemRepository.save(auction);

            notificationService.notifyAuctionClosed(auction);
        }
    }
    public Map<Integer, Long> getAuctionItemCountByMonth() {
        List<Object[]> results = auctionItemRepository.findAuctionItemsByMonth();
        Map<Integer, Long> monthlyCounts = new HashMap<>();
        for (Object[] result : results) {
            Integer month = (Integer) result[0];
            Long count = (Long) result[1];
            monthlyCounts.put(month, count);
        }
        return monthlyCounts;
    }

    private void validateAuctionOwnership(AuctionItem auction) {
        User currentUser = userRepository.findById(userService.getCurrentUser().getId())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        if (!auction.getSeller().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != User.Role.ADMIN) {
            throw new UnauthorizedException("Not authorized to modify this auction");
        }
    }

    private void validateCreateAuctionRequest(CreateAuctionRequest request) {
        if (!StringUtils.hasText(request.getTitle())) {
            throw new ValidationException("Title is required");
        }
        if (!StringUtils.hasText(request.getDescription())) {
            throw new ValidationException("Description is required");
        }
        if (request.getStartingPrice() <= 0) {
            throw new ValidationException("Starting price must be greater than 0");
        }
        if (request.getStartTime() == null) {
            throw new ValidationException("Start time is required");
        }
        if (request.getEndTime() == null) {
            throw new ValidationException("End time is required");
        }
    }

    private void validateUpdateAuctionRequest(UpdateAuctionRequest request) {
        if (!StringUtils.hasText(request.getTitle())) {
            throw new ValidationException("Title is required");
        }
        if (!StringUtils.hasText(request.getDescription())) {
            throw new ValidationException("Description is required");
        }
    }

    private void validateAuctionTiming(LocalDateTime startTime, LocalDateTime endTime) {
        LocalDateTime now = LocalDateTime.now();
        if (startTime.isBefore(now)) {
            throw new ValidationException("Start time cannot be in the past");
        }
        if (endTime.isBefore(startTime)) {
            throw new ValidationException("End time must be after start time");
        }
    }

    private void validatePaginationParameters(int page, int size) {
        if (page < 0) {
            throw new ValidationException("Page number cannot be negative");
        }
        if (size <= 0) {
            throw new ValidationException("Page size must be greater than 0");
        }
    }

    private PageRequest createPageRequest(int page, int size) {
        return PageRequest.of(page, size);
    }

    private void updateAuctionFields(AuctionItem auction, UpdateAuctionRequest request) {
        auction.setTitle(request.getTitle());
        auction.setDescription(request.getDescription());
        if (request.getEndTime() != null) {
            validateAuctionTiming(auction.getStartTime(), request.getEndTime());
            auction.setEndTime(request.getEndTime());
        }
    }

    private AuctionItemDto convertToDto(AuctionItem auction) {
        if (auction == null) {
            return null;
        }

        Bid highestBid = auction.getBids() != null && !auction.getBids().isEmpty() ?
                auction.getBids().stream()
                        .max((b1, b2) -> b1.getAmount().compareTo(b2.getAmount()))
                        .orElse(null) : null;

        String frontImageBase64 = auction.getFrontImage() != null ?
                Base64.getEncoder().encodeToString(auction.getFrontImage()) : null;

        List<String> additionalImagesBase64 = auction.getAdditionalImages() != null ?
                auction.getAdditionalImages().stream()
                        .map(img -> Base64.getEncoder().encodeToString(img.getImage()))
                        .collect(Collectors.toList()) :
                new ArrayList<>();

        return new AuctionItemDto(
                auction.getId(),
                auction.getTitle(),
                auction.getDescription(),
                auction.getStartingPrice(),
                auction.getCurrentHighestBid(),
                auction.getStartTime(),
                auction.getEndTime(),
                auction.getSeller().getId(),
                auction.getSeller().getImage(),
                auction.getSeller().getFullName(),
                highestBid != null ? highestBid.getId() : null,
                highestBid != null ? highestBid.getBidder().getFullName() : null,
                frontImageBase64,
                additionalImagesBase64,
                auction.getCategory(),
                auction.getBrand(),
                auction.getViews()
        );

    }
}