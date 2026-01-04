package am.ivixhub.payments.domain;

public enum EscrowStatus {
    HOLD,       // деньги в escrow
    RELEASED,   // выплачено психологу
    REFUNDED    // возвращено клиенту
}
