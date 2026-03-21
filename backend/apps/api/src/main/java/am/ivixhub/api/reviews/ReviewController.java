package am.ivixhub.api.reviews;

import am.ivixhub.api.reviews.domain.Review;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    public record SubmitReviewRequest(
            Long bookingId,
            Integer rating,
            String comment
    ) {
    }

    public record ReviewResponse(
            Long id,
            Long bookingId,
            String targetRole,
            Integer rating,
            String comment,
            OffsetDateTime createdAt
    ) {
    }

    public record MyReviewResponse(
            boolean exists,
            ReviewResponse review
    ) {
    }

    @PostMapping
    public ReviewResponse submit(Authentication auth, @RequestBody SubmitReviewRequest req) {
        Long userId = requireUserId(auth);

        try {
            Review review = reviewService.submit(userId, req.bookingId(), req.rating(), req.comment());
            return map(review);
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @GetMapping("/bookings/{bookingId}/my")
    public MyReviewResponse my(Authentication auth, @PathVariable("bookingId") Long bookingId) {
        Long userId = requireUserId(auth);

        try {
            Review review = reviewService.findMyReview(userId, bookingId);
            if (review == null) {
                return new MyReviewResponse(false, null);
            }
            return new MyReviewResponse(true, map(review));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    private Long requireUserId(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }
        return (Long) auth.getPrincipal();
    }

    private ReviewResponse map(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getBookingId(),
                review.getTargetRole().name(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }
}
