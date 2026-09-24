package am.ivixhub.users.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "password_recovery_codes")
@Getter
@Setter
@NoArgsConstructor
public class PasswordRecoveryCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 50)
    private String phone;

    @Column(name = "code_hash", nullable = false, length = 255)
    private String codeHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PasswordRecoveryStatus status = PasswordRecoveryStatus.CREATED;

    @Column(name = "attempts_left", nullable = false)
    private int attemptsLeft = 5;

    @Column(name = "expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name = "recovery_token_hash", length = 255)
    private String recoveryTokenHash;

    @Column(name = "recovery_token_expires_at")
    private OffsetDateTime recoveryTokenExpiresAt;

    @Column(name = "verified_at")
    private OffsetDateTime verifiedAt;

    @Column(name = "consumed_at")
    private OffsetDateTime consumedAt;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = OffsetDateTime.now();
    }
}
