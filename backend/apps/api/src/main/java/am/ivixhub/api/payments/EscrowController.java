package am.ivixhub.api.payments;

import am.ivixhub.payments.domain.EscrowHold;
import am.ivixhub.payments.domain.EscrowStatus;
import am.ivixhub.payments.repository.EscrowHoldRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/escrow")
public class EscrowController {

    private final EscrowHoldRepository escrowHoldRepository;
    private final PaymentService paymentService;
    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;

    public EscrowController(EscrowHoldRepository escrowHoldRepository,
                            PaymentService paymentService,
                            UserRepository userRepository,
                            PsychologistRepository psychologistRepository) {
        this.escrowHoldRepository = escrowHoldRepository;
        this.paymentService = paymentService;
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
    }

    @GetMapping("/my-holds")
    public List<EscrowHold> myHolds(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        Long psychologistId = psychologist.getId();

        return escrowHoldRepository.findAll()
                .stream()
                .filter(h -> h.getPsychologistId().equals(psychologistId) && h.getStatus() == EscrowStatus.HOLD)
                .toList();
    }

    /**
     * Mock/manual release attempt:
     * - if holdUntil not reached -> stays HOLD
     * - else -> becomes RELEASED
     */
    @PostMapping("/mock/release/{bookingId}")
    public EscrowStatus mockRelease(Authentication auth, @PathVariable("bookingId") Long bookingId) {
        Long userId = (Long) auth.getPrincipal();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        return paymentService.releaseEscrowIfEligible(psychologist.getId(), bookingId);
    }
}

