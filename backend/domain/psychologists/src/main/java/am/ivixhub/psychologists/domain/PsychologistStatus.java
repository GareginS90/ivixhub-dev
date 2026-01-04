package am.ivixhub.psychologists.domain;

public enum PsychologistStatus {
    DRAFT,                // начал онбординг
    PENDING_VERIFICATION, // документы отправлены
    VERIFIED,             // подтверждён платформой
    REJECTED,             // отклонён
    SUSPENDED             // временно заблокирован
}
