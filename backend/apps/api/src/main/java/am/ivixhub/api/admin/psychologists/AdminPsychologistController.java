package am.ivixhub.api.admin.psychologists;

import am.ivixhub.api.audit.AuditService;
import am.ivixhub.psychologists.domain.Psychologist;
import am.ivixhub.psychologists.domain.PsychologistStatus;
import am.ivixhub.psychologists.repository.PsychologistRepository;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/psychologists")
public class AdminPsychologistController {

    private final PsychologistRepository psychologistRepository;
    private final AuditService auditService;

    public AdminPsychologistController(PsychologistRepository psychologistRepository,
                                       AuditService auditService) {
        this.psychologistRepository = psychologistRepository;
        this.auditService = auditService;
    }

    @GetMapping("/pending")
    public List<PendingPsychologistResponse> pending(Authentication auth) {
        Long adminUserId = (Long) auth.getPrincipal();

        // audit (view list) — ip/ua позже добавим через AuditContext
        auditService.log(
                adminUserId,
                "PSYCHOLOGIST_PENDING_LIST",
                "Psychologist",
                null,
                "Admin viewed pending list",
                null,
                null
        );

        return psychologistRepository.findAllByStatus(PsychologistStatus.PENDING_VERIFICATION)
                .stream()
                .map(p -> new PendingPsychologistResponse(
                        p.getId(),
                        p.getUser().getId(),
                        p.getUser().getEmail(),
                        p.getUser().getPhone(),
                        p.getUser().isPhoneVerified(),
                        p.getStatus(),
                        p.getExperienceYears(),
                        p.getBio(),
                        p.getSubmittedAt()
                ))
                .toList();
    }

    @PostMapping("/{psychologistId}/approve")
    public AdminPsychologistDecisionResponse approve(Authentication auth,
                                                     @PathVariable("psychologistId") Long psychologistId) {
        Long adminUserId = (Long) auth.getPrincipal();

        Psychologist p = psychologistRepository.findById(psychologistId)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        if (p.getStatus() != PsychologistStatus.PENDING_VERIFICATION) {
            throw new IllegalArgumentException("Not in PENDING_VERIFICATION");
        }

        p.setStatus(PsychologistStatus.VERIFIED);
        p.setVerifiedAt(OffsetDateTime.now());
        p.setReviewedAt(OffsetDateTime.now());
        p.setReviewedByUserId(adminUserId);
        p.setRejectionReason(null);

        Psychologist saved = psychologistRepository.save(p);

        auditService.log(
                adminUserId,
                "PSYCHOLOGIST_APPROVE",
                "Psychologist",
                saved.getId(),
                "Approved psychologist. userId=" + saved.getUser().getId(),
                null,
                null
        );

        return new AdminPsychologistDecisionResponse(
                saved.getId(),
                saved.getUser().getId(),
                saved.getUser().getEmail(),
                saved.getUser().getPhone(),
                saved.getUser().isPhoneVerified(),
                saved.getStatus(),
                saved.getSubmittedAt(),
                saved.getVerifiedAt(),
                saved.getReviewedByUserId(),
                saved.getReviewedAt(),
                saved.getRejectionReason()
        );
    }

    @PostMapping("/{psychologistId}/reject")
    public AdminPsychologistDecisionResponse reject(Authentication auth,
                                                    @PathVariable("psychologistId") Long psychologistId,
                                                    @Valid @RequestBody RejectPsychologistRequest req) {
        Long adminUserId = (Long) auth.getPrincipal();

        Psychologist p = psychologistRepository.findById(psychologistId)
                .orElseThrow(() -> new IllegalArgumentException("Psychologist not found"));

        if (p.getStatus() != PsychologistStatus.PENDING_VERIFICATION) {
            throw new IllegalArgumentException("Not in PENDING_VERIFICATION");
        }

        p.setStatus(PsychologistStatus.REJECTED);
        p.setReviewedAt(OffsetDateTime.now());
        p.setReviewedByUserId(adminUserId);
        p.setRejectionReason(req.reason());

        Psychologist saved = psychologistRepository.save(p);

        auditService.log(
                adminUserId,
                "PSYCHOLOGIST_REJECT",
                "Psychologist",
                saved.getId(),
                "Rejected psychologist. reason=" + req.reason(),
                null,
                null
        );

        return new AdminPsychologistDecisionResponse(
                saved.getId(),
                saved.getUser().getId(),
                saved.getUser().getEmail(),
                saved.getUser().getPhone(),
                saved.getUser().isPhoneVerified(),
                saved.getStatus(),
                saved.getSubmittedAt(),
                saved.getVerifiedAt(),
                saved.getReviewedByUserId(),
                saved.getReviewedAt(),
                saved.getRejectionReason()
        );
    }
}

