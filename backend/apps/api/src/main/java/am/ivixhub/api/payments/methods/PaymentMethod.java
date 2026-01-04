package am.ivixhub.api.payments.methods;

public enum PaymentMethod {
    CARD,     // bank acquiring (ArCa/Visa/MC) – global cards
    IDRAM,    // local wallet
    TELCELL   // local wallet
}
