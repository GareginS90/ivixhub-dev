package am.ivixhub.bookings.repository;

import am.ivixhub.bookings.domain.Booking;
import am.ivixhub.bookings.domain.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findAllByClientUserIdOrderByStartAtDesc(Long clientUserId);

    Optional<Booking> findByIdAndClientUserId(Long id, Long clientUserId);

    @Query("""
        select b from Booking b
        where b.psychologistId = :psychologistId
          and b.startAt < :to
          and b.endAt > :from
          and b.status not in :excludedStatuses
    """)
    List<Booking> findConflicts(@Param("psychologistId") Long psychologistId,
                                @Param("from") OffsetDateTime from,
                                @Param("to") OffsetDateTime to,
                                @Param("excludedStatuses") List<BookingStatus> excludedStatuses);

    @Query("""
        select (count(b) > 0) from Booking b
        where b.psychologistId = :psychologistId
          and b.startAt < :endAt
          and b.endAt > :startAt
          and b.status not in :excludedStatuses
    """)
    boolean existsOverlapExcluding(@Param("psychologistId") Long psychologistId,
                                   @Param("startAt") OffsetDateTime startAt,
                                   @Param("endAt") OffsetDateTime endAt,
                                   @Param("excludedStatuses") List<BookingStatus> excludedStatuses);
}

