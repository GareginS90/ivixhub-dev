package am.ivixhub.api.reviews;

import am.ivixhub.api.reviews.domain.Review;
import am.ivixhub.api.reviews.domain.ReviewTargetRole;
import am.ivixhub.api.reviews.repository.ReviewRepository;
import am.ivixhub.bookings.domain.BookingStatus;
import am.ivixhub.bookings.repository.BookingRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.domain.User;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final PsychologistRepository psychologistRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         BookingRepository bookingRepository,
                         PsychologistRepository psychologistRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.psychologistRepository = psychologistRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Review submit(Long authorUserId, Long bookingId, Integer rating, String comment) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        String normalizedComment = normalizeComment(comment);

        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new IllegalArgumentException("Review is allowed only for COMPLETED bookings");
        }

        if (reviewRepository.existsByBookingIdAndAuthorUserId(bookingId, authorUserId)) {
            throw new IllegalArgumentException("You have already submitted a review for this booking");
        }

        var psychologist = psychologistRepository.findById(booking.getPsychologistId())
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        Long psychologistUserId = psychologist.getUser().getId();
        Long clientUserId = booking.getClientUserId();

        Review review = new Review();
        review.setBookingId(bookingId);
        review.setAuthorUserId(authorUserId);
        review.setRating(rating);
        review.setComment(normalizedComment);

        if (authorUserId.equals(clientUserId)) {
            review.setSubjectUserId(psychologistUserId);
            review.setTargetRole(ReviewTargetRole.PSYCHOLOGIST);
        } else if (authorUserId.equals(psychologistUserId)) {
            review.setSubjectUserId(clientUserId);
            review.setTargetRole(ReviewTargetRole.CLIENT);
        } else {
            throw new IllegalArgumentException("No access to booking review");
        }

        return reviewRepository.save(review);
    }

    @Transactional
    public Review reply(Long replierUserId, Long reviewId, String replyComment) {
        String normalizedReply = normalizeRequiredReply(replyComment);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found"));

        if (!review.getSubjectUserId().equals(replierUserId)) {
            throw new IllegalArgumentException("No access to reply to this review");
        }

        if (review.getReplyComment() != null && !review.getReplyComment().isBlank()) {
            throw new IllegalArgumentException("Reply already exists for this review");
        }

        review.setReplyComment(normalizedReply);
        review.setReplyAuthorUserId(replierUserId);
        review.setRepliedAt(OffsetDateTime.now());

        return reviewRepository.save(review);
    }

    @Transactional(readOnly = true)
    public Review findMyReview(Long authorUserId, Long bookingId) {
        var booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        var psychologist = psychologistRepository.findById(booking.getPsychologistId())
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        Long psychologistUserId = psychologist.getUser().getId();
        Long clientUserId = booking.getClientUserId();

        boolean hasAccess = authorUserId.equals(clientUserId) || authorUserId.equals(psychologistUserId);
        if (!hasAccess) {
            throw new IllegalArgumentException("No access to booking review");
        }

        return reviewRepository.findByBookingIdAndAuthorUserId(bookingId, authorUserId).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<ReceivedReviewItem> getMyReceivedReviews(Long userId) {
        return reviewRepository.findAllBySubjectUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapReceivedReview)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicPsychologistReviewBundle getPsychologistPublicReviews(Long psychologistId) {
        var psychologist = psychologistRepository.findById(psychologistId)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        Long psychologistUserId = psychologist.getUser().getId();

        var summary = reviewRepository.summarizeBySubjectAndTargetRole(
                psychologistUserId,
                ReviewTargetRole.PSYCHOLOGIST
        );

        Double ratingAvg = summary != null ? summary.getRatingAvg() : null;
        long reviewsCount = summary != null ? summary.getReviewsCount() : 0L;

        List<PublicPsychologistReviewItem> items = reviewRepository
                .findTop5BySubjectUserIdAndTargetRoleOrderByCreatedAtDesc(
                        psychologistUserId,
                        ReviewTargetRole.PSYCHOLOGIST
                )
                .stream()
                .map(this::mapPublicReview)
                .toList();

        return new PublicPsychologistReviewBundle(ratingAvg, (int) reviewsCount, items);
    }

    @Transactional(readOnly = true)
    public ClientReviewBundle getClientReviewSummaryForPsychologist(Long psychologistUserId, Long clientUserId) {
        var psychologistUser = userRepository.findById(psychologistUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var psychologist = psychologistRepository.findByUser(psychologistUser)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        boolean related = bookingRepository.existsByClientUserIdAndPsychologistId(clientUserId, psychologist.getId());
        if (!related) {
            throw new IllegalArgumentException("No access to client review summary");
        }

        var summary = reviewRepository.summarizeBySubjectAndTargetRole(
                clientUserId,
                ReviewTargetRole.CLIENT
        );

        Double ratingAvg = summary != null ? summary.getRatingAvg() : null;
        long reviewsCount = summary != null ? summary.getReviewsCount() : 0L;

        List<ClientReviewItem> items = reviewRepository
                .findTop5BySubjectUserIdAndTargetRoleOrderByCreatedAtDesc(
                        clientUserId,
                        ReviewTargetRole.CLIENT
                )
                .stream()
                .map(this::mapClientReview)
                .toList();

        return new ClientReviewBundle(ratingAvg, (int) reviewsCount, items);
    }

    private ReceivedReviewItem mapReceivedReview(Review review) {
        String authorDisplayName = userRepository.findById(review.getAuthorUserId())
                .map(this::resolveUserDisplayName)
                .orElse("User");

        return new ReceivedReviewItem(
                review.getId(),
                review.getBookingId(),
                review.getTargetRole().name(),
                review.getRating(),
                review.getComment(),
                authorDisplayName,
                review.getCreatedAt(),
                review.getReplyComment(),
                review.getRepliedAt()
        );
    }

    private PublicPsychologistReviewItem mapPublicReview(Review review) {
        String authorDisplayName = userRepository.findById(review.getAuthorUserId())
                .map(this::resolveUserDisplayName)
                .orElse("User");

        return new PublicPsychologistReviewItem(
                review.getId(),
                review.getRating(),
                review.getComment(),
                authorDisplayName,
                review.getCreatedAt(),
                review.getReplyComment(),
                review.getRepliedAt()
        );
    }

    private ClientReviewItem mapClientReview(Review review) {
        String authorDisplayName = userRepository.findById(review.getAuthorUserId())
                .map(this::resolveUserDisplayName)
                .orElse("User");

        return new ClientReviewItem(
                review.getId(),
                review.getRating(),
                review.getComment(),
                authorDisplayName,
                review.getCreatedAt(),
                review.getReplyComment(),
                review.getRepliedAt()
        );
    }

    private String resolveUserDisplayName(User user) {
        if (user.getFullName() != null && !user.getFullName().trim().isBlank()) {
            return user.getFullName().trim();
        }
        if (user.getUsername() != null && !user.getUsername().trim().isBlank()) {
            return user.getUsername().trim();
        }
        return "User";
    }

    private String normalizeComment(String comment) {
        if (comment == null) {
            return null;
        }

        String normalized = comment.trim();
        if (normalized.isBlank()) {
            return null;
        }

        if (normalized.length() > 2000) {
            throw new IllegalArgumentException("Comment must be at most 2000 characters");
        }

        return normalized;
    }

    private String normalizeRequiredReply(String comment) {
        String normalized = normalizeComment(comment);
        if (normalized == null) {
            throw new IllegalArgumentException("Reply comment is required");
        }
        return normalized;
    }

    public record PublicPsychologistReviewBundle(
            Double ratingAvg,
            Integer reviewsCount,
            List<PublicPsychologistReviewItem> recentReviews
    ) {
    }

    public record PublicPsychologistReviewItem(
            Long id,
            Integer rating,
            String comment,
            String authorDisplayName,
            OffsetDateTime createdAt,
            String replyComment,
            OffsetDateTime repliedAt
    ) {
    }

    public record ClientReviewBundle(
            Double ratingAvg,
            Integer reviewsCount,
            List<ClientReviewItem> recentReviews
    ) {
    }

    public record ClientReviewItem(
            Long id,
            Integer rating,
            String comment,
            String authorDisplayName,
            OffsetDateTime createdAt,
            String replyComment,
            OffsetDateTime repliedAt
    ) {
    }

    public record ReceivedReviewItem(
            Long id,
            Long bookingId,
            String targetRole,
            Integer rating,
            String comment,
            String authorDisplayName,
            OffsetDateTime createdAt,
            String replyComment,
            OffsetDateTime repliedAt
    ) {
    }
}
