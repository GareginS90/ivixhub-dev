package am.ivixhub.users.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "phone_verification_codes",
        indexes = {
                @Index(name = "idx_pvc_user_id", columnList = "user_id"),
                @Index(name = "idx_pvc_expires_at", columnList = "expires_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
public class PhoneVerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @Column(name="phone", nullable = false, length = 50)
    private String phone;

    @Column(name="code_hash", nullable = false, length = 255)
    private String codeHash;

    @Column(name="expires_at", nullable = false)
    private OffsetDateTime expiresAt;

    @Column(name="attempts_left", nullable = false)
    private int attemptsLeft;

    @Column(name="used", nullable = false)
    private boolean used = false;

    @Column(name="created_at", nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();
}
