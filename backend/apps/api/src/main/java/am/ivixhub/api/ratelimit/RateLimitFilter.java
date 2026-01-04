package am.ivixhub.api.ratelimit;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private final SimpleRateLimiter limiter;

    public RateLimitFilter(SimpleRateLimiter limiter) {
        this.limiter = limiter;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();
        String method = request.getMethod();

        // ключ по IP + path group
        String ip = request.getRemoteAddr();
        String key;

        // AUTH
        if (path.equals("/api/public/auth/login") || path.equals("/api/public/auth/register")) {
            key = "auth:" + ip;
            if (!limiter.allow(key, 20, 60)) { // 20/min
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                return;
            }
        }

        // OTP
        if (path.startsWith("/api/phone/start")) {
            key = "otp_start:" + ip;
            if (!limiter.allow(key, 10, 60)) { // 10/min
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                return;
            }
        }
        if (path.startsWith("/api/phone/verify")) {
            key = "otp_verify:" + ip;
            if (!limiter.allow(key, 20, 60)) { // 20/min
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                return;
            }
        }

        // Payments mock pay
        if (path.startsWith("/api/payments/mock/pay") && method.equals("POST")) {
            key = "pay:" + ip;
            if (!limiter.allow(key, 10, 60)) { // 10/min
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                return;
            }
        }

        // Chat send
        if (path.startsWith("/api/chat/") && method.equals("POST")) {
            key = "chat_send:" + ip;
            if (!limiter.allow(key, 60, 60)) { // 60/min
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
