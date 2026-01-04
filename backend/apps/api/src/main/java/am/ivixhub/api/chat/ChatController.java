package am.ivixhub.api.chat;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    public record SendMessageRequest(
            @NotBlank @Size(max = 4000) String text
    ) {}

    /**
     * Cursor pagination:
     * GET /api/chat/{bookingId}?limit=50&beforeId=123
     */
    @GetMapping("/{bookingId}")
    public ChatService.ChatPageResponse list(Authentication auth,
                                             @PathVariable("bookingId") Long bookingId,
                                             @RequestParam(value = "limit", required = false) Integer limit,
                                             @RequestParam(value = "beforeId", required = false) Long beforeId) {
        Long userId = (Long) auth.getPrincipal();
        return chatService.list(userId, bookingId, limit, beforeId);
    }

    @PostMapping("/{bookingId}")
    public ChatService.ChatMessageResponse send(Authentication auth,
                                                @PathVariable("bookingId") Long bookingId,
                                                @Valid @RequestBody SendMessageRequest req) {
        Long userId = (Long) auth.getPrincipal();
        return chatService.send(userId, bookingId, req.text());
    }
}

