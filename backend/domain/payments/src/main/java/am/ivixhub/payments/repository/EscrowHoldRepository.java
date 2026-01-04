package am.ivixhub.payments.repository;

import am.ivixhub.payments.domain.EscrowHold;
import am.ivixhub.payments.domain.EscrowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

public interface EscrowHoldRepository extends JpaRepository<EscrowHold, Long> {

    Optional<EscrowHold> findByBookingId(Long bookingId);

    @Query("""
        select e from EscrowHold e
        where e.status = :status
          and e.holdUntil <= :now
    """)
    List<EscrowHold> findReadyForRelease(@Param("status") EscrowStatus status,
                                         @Param("now") OffsetDateTime now);

    List<EscrowHold> findAllByPsychologistIdAndStatus(Long psychologistId, EscrowStatus status);
}

