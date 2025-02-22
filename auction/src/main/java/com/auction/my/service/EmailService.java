package com.auction.my.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Sends an email to the specified recipient.
     *
     * @param toEmail The recipient email address.
     * @param subject The subject of the email.
     * @param body    The body content of the email.
     * @throws MessagingException If there is an error in sending the email.
     */
    public void sendEmail(String toEmail, String subject, String body) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper = new MimeMessageHelper(mimeMessage, "utf-8");

        messageHelper.setText(body, true);
        messageHelper.setSubject(subject);
        messageHelper.setTo(toEmail);
        messageHelper.setFrom(fromEmail);

        mailSender.send(mimeMessage);
    }
}
