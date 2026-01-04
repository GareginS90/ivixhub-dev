package am.ivixhub.api.chat;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class WsChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate broker;

    public WsChatController(ChatService chatService, SimpMessagingTemplate broker) {
        this.chatService = chatService;
        this.broker = broker;
    }

    public record WsSendMessageRequest(Long bookingId, String text) {}

    @MessageMapping("/chat.send")
    public void send(Principal principal, WsSendMessageRequest req) {
        Long userId = Long.valueOf(principal.getName());
        var saved = chatService.send(userId, req.bookingId(), req.text());

        // broadcast to booking topic
        broker.convertAndSend("/topic/booking." + req.bookingId(), saved);
    }
}
