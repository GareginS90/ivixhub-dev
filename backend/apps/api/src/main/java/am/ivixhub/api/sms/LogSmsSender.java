package am.ivixhub.api.sms;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class LogSmsSender implements SmsSender {

    private static final Logger log = LoggerFactory.getLogger(LogSmsSender.class);

    @Override
    public void send(String phone, String message) {
        log.info("[SMS MOCK] to={} message={}", phone, message);
    }
}
