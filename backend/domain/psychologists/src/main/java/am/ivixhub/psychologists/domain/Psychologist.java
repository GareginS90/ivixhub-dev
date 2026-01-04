package am.ivixhub.psychologists.domain;

import am.ivixhub.users.domain.User;
import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "psychologists")
public class Psychologist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private PsychologistStatus status = PsychologistStatus.DRAFT;

    @Column(name = "experience_years", nullable = false)
    private int experienceYears = 0;

    @Column(length = 2000)
    private String bio;

    @Column(name = "submitted_at")
    private OffsetDateTime submittedAt;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @Column(name = "reviewed_by_user_id")
    private Long reviewedByUserId;

    @Column(name = "reviewed_at")
    private OffsetDateTime reviewedAt;

    @Column(name = "rejection_reason", length = 1000)
    private String rejectionReason;

    @Column(nullable = false)
    private boolean active = true;

    // =========================
    // Collections
    // =========================

    /**
     * Languages are stored as VARCHAR in DB (Flyway V1).
     * ✅ Must be EnumType.STRING (otherwise Hibernate defaults to ORDINAL -> smallint).
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "psychologist_languages", joinColumns = @JoinColumn(name = "psychologist_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "language", nullable = false, length = 10)
    private Set<PsychologistLanguage> languages = new HashSet<>();

    /**
     * Therapy methods as catalog codes (lowercase), e.g. "cbt"
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "psychologist_methods", joinColumns = @JoinColumn(name = "psychologist_id"))
    @Column(name = "method", nullable = false, length = 64)
    private Set<String> methods = new HashSet<>();

    /**
     * Specializations as catalog codes (lowercase), e.g. "anxiety"
     */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "psychologist_specializations", joinColumns = @JoinColumn(name = "psychologist_id"))
    @Column(name = "specialization", nullable = false, length = 100)
    private Set<String> specializations = new HashSet<>();

    // =========================
    // getters/setters
    // =========================

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public PsychologistStatus getStatus() { return status; }
    public void setStatus(PsychologistStatus status) { this.status = status; }

    public int getExperienceYears() { return experienceYears; }
    public void setExperienceYears(int experienceYears) { this.experienceYears = experienceYears; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public OffsetDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(OffsetDateTime submittedAt) { this.submittedAt = submittedAt; }

    public OffsetDateTime getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(OffsetDateTime verifiedAt) { this.verifiedAt = verifiedAt; }

    public Long getReviewedByUserId() { return reviewedByUserId; }
    public void setReviewedByUserId(Long reviewedByUserId) { this.reviewedByUserId = reviewedByUserId; }

    public OffsetDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(OffsetDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public Set<PsychologistLanguage> getLanguages() { return languages; }
    public void setLanguages(Set<PsychologistLanguage> languages) { this.languages = languages; }

    public Set<String> getMethods() { return methods; }
    public void setMethods(Set<String> methods) { this.methods = methods; }

    public Set<String> getSpecializations() { return specializations; }
    public void setSpecializations(Set<String> specializations) { this.specializations = specializations; }
}

