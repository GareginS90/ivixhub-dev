package am.ivixhub.payments.repository;

import am.ivixhub.payments.domain.PaymentEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentEventRepository extends JpaRepository<PaymentEvent, Long> {
    Optional<PaymentEvent> findTopByPaymentIntentIdOrderByIdDesc(Long paymentIntentId);
    boolean existsByProviderEventId(String providerEventId);
}
