package com.auction.my.service;

import com.auction.my.dto.ReportRequestDTO;
import com.auction.my.dto.ReportResponseDTO;
import com.auction.my.entity.User;
import com.auction.my.model.Report;
import com.auction.my.repository.ReportRepository;
import com.auction.my.repository.AuctionItemRepository;
import com.auction.my.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final AuctionItemRepository auctionItemRepository;
    private final UserRepository userRepository;

    @Autowired
    public ReportService(ReportRepository reportRepository, AuctionItemRepository auctionItemRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.auctionItemRepository = auctionItemRepository;
        this.userRepository = userRepository;
    }

    // Map Report entity to ReportResponseDTO
    private ReportResponseDTO mapToResponseDTO(Report report) {
        if (report == null) {
            throw new IllegalArgumentException("Report cannot be null");
        }
        return new ReportResponseDTO(
                report.getId(),
                report.getContent(),
                report.getCreatedAt(),
                report.isResolved(),
                report.getUser() != null ? report.getUser().getId() : null,
                report.getUser() != null ? report.getUser().getEmail() : null
        );
    }

    public ReportResponseDTO createReport(ReportRequestDTO requestDTO) {
        User user = userRepository.findById(requestDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + requestDTO.getUserId()));

        Report report = new Report();
        report.setContent(requestDTO.getContent());
        report.setUser(user);
        report.setCreatedAt(new Date());
        report.setResolved(false);

        Report createdReport = reportRepository.save(report);
        return mapToResponseDTO(createdReport);
    }


    public ReportResponseDTO updateReport(Long reportId, ReportRequestDTO requestDTO) {
        Report existingReport = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));

        if (requestDTO.getContent() != null) {
            existingReport.setContent(requestDTO.getContent());
        }

        if (requestDTO.getUserId() != null && !requestDTO.getUserId().equals(existingReport.getUser().getId())) {
            User newUser = userRepository.findById(requestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + requestDTO.getUserId()));
            existingReport.setUser(newUser);
        }

        Report updatedReport = reportRepository.save(existingReport);
        return mapToResponseDTO(updatedReport);
    }

    public void deleteReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        reportRepository.delete(report);
    }
    // Get all unresolved reports
    public List<ReportResponseDTO> getUnresolvedReports() {
        List<Report> reports = reportRepository.findByResolvedFalse();
        return reports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    // Resolve a report by its ID
    public ReportResponseDTO resolveReport(Long reportId) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        report.setResolved(true);
        Report updatedReport = reportRepository.save(report);
        return mapToResponseDTO(updatedReport);
    }

    // Get reports by user ID (either created or related to auction items)
    public List<ReportResponseDTO> getReportsByUserId(Long userId) {
        List<Report> reports = reportRepository.findByUserId(userId); // Assumes this method exists in the repository
        return reports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }



    public List<ReportResponseDTO> getAllReports(int page, int size) {
        List<Report> reports = reportRepository.findAll(PageRequest.of(page, size)).getContent();
        return reports.stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }
}
