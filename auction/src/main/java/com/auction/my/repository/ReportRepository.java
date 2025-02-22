package com.auction.my.repository;

import com.auction.my.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    List<Report> findByResolvedFalse();

    List<Report> findByUserId(Long userId);

}
