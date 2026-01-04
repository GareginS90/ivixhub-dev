package am.ivixhub.psychologists.repository;

import am.ivixhub.psychologists.domain.PsychologistAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.List;

public interface PsychologistAvailabilityRepository extends JpaRepository<PsychologistAvailability, Long> {

    List<PsychologistAvailability> findAllByPsychologistIdAndActiveTrue(Long psychologistId);

    /**
     * ✅ day_of_week stored as MON/TUE/WED/THU/FRI/SAT/SUN
     * We compute same short code from startAtUtc:
     * to_char(ts, 'DY') returns e.g. 'FRI' (in English locale), we upper it.
     */
    @Query(value = """
        select exists (
          select 1
          from psychologist_availability a
          where a.psychologist_id = :psychologistId
            and a.active = true
            and a.day_of_week = upper(to_char((:startAtUtc at time zone 'UTC'), 'DY'))
            and a.start_time_utc <= ((:startAtUtc at time zone 'UTC')::time)
            and a.end_time_utc >= ((:endAtUtc at time zone 'UTC')::time)
        )
        """, nativeQuery = true)
    boolean isSlotAvailable(@Param("psychologistId") Long psychologistId,
                            @Param("startAtUtc") OffsetDateTime startAtUtc,
                            @Param("endAtUtc") OffsetDateTime endAtUtc);
}

