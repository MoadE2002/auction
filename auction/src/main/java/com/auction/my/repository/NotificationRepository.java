package com.auction.my.repository;

import com.auction.my.entity.Notification;
import com.auction.my.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserId(Long userId);

    List<Notification> findByUserIdAndIsReadFalse(Long userId);



    Page<Notification> findByUserAndIsReadFalseOrderByTimestampDesc(User user, Pageable pageable);

    Page<Notification> findByUserOrderByTimestampDesc(User user, Pageable pageable);


    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true WHERE n.user.id = :userId")
    void markAllAsRead(Long userId);
}
