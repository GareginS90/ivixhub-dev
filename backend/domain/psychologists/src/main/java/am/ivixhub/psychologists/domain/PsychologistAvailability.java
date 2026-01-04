package am.ivixhub.psychologists.domain;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(
        name = "psychologist_availability",
        indexes = {
                @Index(name = "idx_pa_psychologist_id", columnList = "psychologist_id"),
                @Index(name = "idx_pa_day", columnList = "day_of_week")
        }
)
public class PsychologistAvailability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="psychologist_id", nullable = false)
    private Long psychologistId;

    @Enumerated(EnumType.STRING)
    @Column(name="day_of_week", nullable = false, length = 10)
    private WeekDay dayOfWeek;

    // UTC local time (e.g., 10:00)
    @Column(name="start_time_utc", nullable = false)
    private LocalTime startTimeUtc;

    @Column(name="end_time_utc", nullable = false)
    private LocalTime endTimeUtc;

    @Column(nullable = false)
    private boolean active = true;

    public Long getId() { return id; }

    public Long getPsychologistId() { return psychologistId; }
    public void setPsychologistId(Long psychologistId) { this.psychologistId = psychologistId; }

    public WeekDay getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(WeekDay dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTimeUtc() { return startTimeUtc; }
    public void setStartTimeUtc(LocalTime startTimeUtc) { this.startTimeUtc = startTimeUtc; }

    public LocalTime getEndTimeUtc() { return endTimeUtc; }
    public void setEndTimeUtc(LocalTime endTimeUtc) { this.endTimeUtc = endTimeUtc; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
