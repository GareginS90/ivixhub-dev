package am.ivixhub.payments.repository;

import am.ivixhub.payments.domain.PaymentIntent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentIntentRepository extends JpaRepository<PaymentIntent, Long> {

    Optional<PaymentIntent> findTopByBookingIdOrderByIdDesc(Long bookingId);

    Optional<PaymentIntent> findByProviderPaymentId(String providerPaymentId);
}

