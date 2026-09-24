package am.ivixhub.api.notifications;

import java.util.List;

public record NotificationListResponse(
        long unreadCount,
        List<NotificationResponse> items
) {}
