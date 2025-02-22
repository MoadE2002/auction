package com.auction.my.controller;

import com.auction.my.dto.ReportRequestDTO;
import com.auction.my.dto.ReportResponseDTO;
import com.auction.my.exception.UnauthorizedException;
import com.auction.my.service.JwtService;
import com.auction.my.service.ReportService;
import com.auction.my.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private final JwtService jwtService;

    @Autowired
    public ReportController(ReportService reportService, UserService userService, JwtService jwtService) {
        this.reportService = reportService;
        this.jwtService = jwtService;

    }

    // Get all unresolved reports
    @GetMapping("/unresolved")
    public ResponseEntity<List<ReportResponseDTO>> getUnresolvedReports() {
        List<ReportResponseDTO> unresolvedReports = reportService.getUnresolvedReports();
        return ResponseEntity.ok(unresolvedReports);
    }

    // Resolve a report by its ID
    @PutMapping("/resolve/{reportId}")
    public ResponseEntity<ReportResponseDTO> resolveReport(@PathVariable Long reportId) {
        ReportResponseDTO resolvedReport = reportService.resolveReport(reportId);
        return ResponseEntity.ok(resolvedReport);
    }

    // Get reports by user ID (either created or related to auction items)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ReportResponseDTO>> getReportsByUserId(@PathVariable Long userId) {
        List<ReportResponseDTO> reports = reportService.getReportsByUserId(userId);
        return ResponseEntity.ok(reports);
    }

    // Get all reports with pagination
    @GetMapping("/all")
    public ResponseEntity<List<ReportResponseDTO>> getAllReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<ReportResponseDTO> reports = reportService.getAllReports(page, size);
        return ResponseEntity.ok(reports);
    }

    // Create a new report with user ID validation
    @PostMapping("/create")
    public ResponseEntity<?> createReport(
            @RequestBody ReportRequestDTO reportRequestDTO,
            @RequestHeader("Authorization") String authorization) {

        // Extract user ID from the JWT token
        String jwtToken = authorization.replace("Bearer ", "");
        Long userIdFromToken = Long.valueOf(jwtService.extractUserId(jwtToken));

        // Check if the user ID in the token matches the one in the request
        if (!userIdFromToken.equals(reportRequestDTO.getUserId())) {
            throw new UnauthorizedException("You are not authorized to create a report for this user.");
        }

        // Create the report
        ReportResponseDTO createdReport = reportService.createReport(reportRequestDTO);
        return new ResponseEntity<>(createdReport, HttpStatus.CREATED);
    }


    // Update an existing report
    @PutMapping("/update/{reportId}")
    public ResponseEntity<ReportResponseDTO> updateReport(
            @PathVariable Long reportId,
            @RequestBody ReportRequestDTO reportRequestDTO) {
        ReportResponseDTO updatedReport = reportService.updateReport(reportId, reportRequestDTO);
        return ResponseEntity.ok(updatedReport);
    }

    // Delete a report by its ID
    @DeleteMapping("/delete/{reportId}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }
}
