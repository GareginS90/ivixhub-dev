package am.ivixhub.api.video.providers;

import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.UUID;

@Component
public class MockVideoProvider implements VideoProvider {

    @Override
    public String providerName() {
        return "MOCK_VIDEO";
    }

    @Override
    public CreateRoomResult createRoom(CreateRoomRequest req) {
        String channelName = (req.channelName() == null || req.channelName().isBlank())
                ? "booking-" + req.bookingId()
                : req.channelName();

        String roomId = "room-" + UUID.randomUUID();
        String roomUrl = "https://mock.video/" + channelName;
        return new CreateRoomResult(providerName(), roomId, roomUrl, channelName);
    }

    @Override
    public CreateJoinTokenResult createJoinToken(CreateJoinTokenRequest req) {
        OffsetDateTime exp = req.expiresAtUtc() != null ? req.expiresAtUtc() : OffsetDateTime.now().plusMinutes(60);
        String token = "mock-token-" + req.channelName() + "-" + req.userId() + "-" + UUID.randomUUID();
        return new CreateJoinTokenResult(providerName(), token, exp);
    }
}

