package com.godayana.visa_gateway_content.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "stories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "type", nullable = false, length = 50)
    private String type;

    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "author", nullable = false, length = 100)
    private String author;

    @Column(name = "author_role", length = 100)
    private String authorRole;

    @Column(name = "author_location", length = 100)
    private String authorLocation;

    @Column(name = "category", length = 50)
    private String category;

    @Column(name = "likes")
    @Builder.Default
    private Integer likes = 0;

    @Column(name = "image", length = 500)
    private String imageKey;

    @Column(name = "avatar", length = 500)
    private String avatarKey;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}