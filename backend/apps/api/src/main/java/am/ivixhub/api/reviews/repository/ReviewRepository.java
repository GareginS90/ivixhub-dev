package am.ivixhub.api.reviews.repository;

import am.ivixhub.api.reviews.domain.Review;
import am.ivixhub.api.reviews.domain.ReviewTargetRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    interface ReviewSummaryView {
        Double getRatingAvg();
        long getReviewsCount();
    }

    boolean existsByBookingIdAndAuthorUserId(Long bookingId, Long authorUserId);

    Optional<Review> findByBookingIdAndAuthorUserId(Long bookingId, Long authorUserId);

    List<Review> findTop5BySubjectUserIdAndTargetRoleOrderByCreatedAtDesc(Long subjectUserId, ReviewTargetRole targetRole);

    List<Review> findAllBySubjectUserIdAndTargetRoleOrderByCreatedAtDesc(Long subjectUserId, ReviewTargetRole targetRole);

    List<Review> findAllBySubjectUserIdOrderByCreatedAtDesc(Long subjectUserId);

    @Query("""
        select avg(r.rating) as ratingAvg, count(r) as reviewsCount
        from Review r
        where r.subjectUserId = :subjectUserId
          and r.targetRole = :targetRole
    """)
    ReviewSummaryView summarizeBySubjectAndTargetRole(@Param("subjectUserId") Long subjectUserId,
                                                      @Param("targetRole") ReviewTargetRole targetRole);
}
