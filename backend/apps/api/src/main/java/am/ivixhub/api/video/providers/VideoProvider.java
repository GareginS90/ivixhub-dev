package am.ivixhub.api.video.providers;

import java.time.OffsetDateTime;

public interface VideoProvider {

    record CreateRoomRequest(Long bookingId, String channelName) {}

    record CreateRoomResult(String providerName, String roomId, String roomUrl, String channelName) {}

    record CreateJoinTokenRequest(
            String channelName,
            Long userId,
            String role,
            OffsetDateTime expiresAtUtc
    ) {}

    record CreateJoinTokenResult(String providerName, String token, OffsetDateTime expiresAtUtc) {}

    String providerName();

    CreateRoomResult createRoom(CreateRoomRequest req);

    CreateJoinTokenResult createJoinToken(CreateJoinTokenRequest req);
}

