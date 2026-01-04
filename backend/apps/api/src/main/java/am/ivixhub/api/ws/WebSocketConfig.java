package am.ivixhub.api.ws;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtHandshakeInterceptor jwtHandshakeInterceptor;
    private final UserIdHandshakeHandler userIdHandshakeHandler;

    public WebSocketConfig(JwtHandshakeInterceptor jwtHandshakeInterceptor,
                           UserIdHandshakeHandler userIdHandshakeHandler) {
        this.jwtHandshakeInterceptor = jwtHandshakeInterceptor;
        this.userIdHandshakeHandler = userIdHandshakeHandler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 1) native ws
        registry.addEndpoint("/ws/chat")
                .addInterceptors(jwtHandshakeInterceptor)
                .setHandshakeHandler(userIdHandshakeHandler)
                .setAllowedOriginPatterns("*");

        // 2) SockJS (самый стабильный вариант для клиентов)
        registry.addEndpoint("/ws/chat-sockjs")
                .addInterceptors(jwtHandshakeInterceptor)
                .setHandshakeHandler(userIdHandshakeHandler)
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}

