package am.ivixhub.api.reviews.domain;

import jakarta.persistence.*;

import java.time.OffsetDateTime;

@Entity
@Table(
        name = "reviews",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_reviews_booking_author", columnNames = {"booking_id", "author_user_id"})
        },
        indexes = {
                @Index(name = "idx_reviews_booking_id", columnList = "booking_id"),
                @Index(name = "idx_reviews_author_user_id", columnList = "author_user_id"),
                @Index(name = "idx_reviews_subject_user_id", columnList = "subject_user_id"),
                @Index(name = "idx_reviews_target_role", columnList = "target_role"),
                @Index(name = "idx_reviews_created_at", columnList = "created_at")
        }
)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "author_user_id", nullable = false)
    private Long authorUserId;

    @Column(name = "subject_user_id", nullable = false)
    private Long subjectUserId;

    @Enumerated(EnumType.STRING)
    @Column(name = "target_role", nullable = false, length = 20)
    private ReviewTargetRole targetRole;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "comment", length = 2000)
    private String comment;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Long getAuthorUserId() {
        return authorUserId;
    }

    public void setAuthorUserId(Long authorUserId) {
        this.authorUserId = authorUserId;
    }

    public Long getSubjectUserId() {
        return subjectUserId;
    }

    public void setSubjectUserId(Long subjectUserId) {
        this.subjectUserId = subjectUserId;
    }

    public ReviewTargetRole getTargetRole() {
        return targetRole;
    }

    public void setTargetRole(ReviewTargetRole targetRole) {
        this.targetRole = targetRole;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
