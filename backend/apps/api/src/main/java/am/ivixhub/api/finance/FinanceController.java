package am.ivixhub.api.finance;

import am.ivixhub.payments.domain.EscrowStatus;
import am.ivixhub.payments.repository.EscrowHoldRepository;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import am.ivixhub.users.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    private final UserRepository userRepository;
    private final PsychologistRepository psychologistRepository;
    private final EscrowHoldRepository escrowHoldRepository;

    public FinanceController(UserRepository userRepository,
                             PsychologistRepository psychologistRepository,
                             EscrowHoldRepository escrowHoldRepository) {
        this.userRepository = userRepository;
        this.psychologistRepository = psychologistRepository;
        this.escrowHoldRepository = escrowHoldRepository;
    }

    @GetMapping("/summary")
    public FinanceSummaryResponse summary(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        var holds = escrowHoldRepository.findAllByPsychologistIdAndStatus(psychologist.getId(), EscrowStatus.HOLD);
        var released = escrowHoldRepository.findAllByPsychologistIdAndStatus(psychologist.getId(), EscrowStatus.RELEASED);

        long holdAmount = holds.stream().mapToLong(h -> h.getAmountMinor()).sum();
        long releasedAmount = released.stream().mapToLong(h -> h.getAmountMinor()).sum();

        return new FinanceSummaryResponse(holdAmount, releasedAmount, "AMD");
    }

    @GetMapping("/holds")
    public List<?> holds(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        return escrowHoldRepository.findAllByPsychologistIdAndStatus(psychologist.getId(), EscrowStatus.HOLD);
    }

    @GetMapping("/payouts")
    public List<?> payouts(Authentication auth) {
        Long userId = (Long) auth.getPrincipal();

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var psychologist = psychologistRepository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist profile not found"));

        return escrowHoldRepository.findAllByPsychologistIdAndStatus(psychologist.getId(), EscrowStatus.RELEASED);
    }
}
