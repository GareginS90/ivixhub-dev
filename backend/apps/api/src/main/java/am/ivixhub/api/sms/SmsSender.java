package am.ivixhub.api.sms;

public interface SmsSender {
    void send(String phone, String message);
}
