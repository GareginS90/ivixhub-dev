package am.ivixhub.api.ws;

import am.ivixhub.api.security.JwtService;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.Principal;
import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;

    public JwtHandshakeInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request,
                                   ServerHttpResponse response,
                                   WebSocketHandler wsHandler,
                                   Map<String, Object> attributes) {

        MultiValueMap<String, String> params = UriComponentsBuilder.fromUri(request.getURI()).build().getQueryParams();
        String token = params.getFirst("token");
        if (token == null || token.isBlank()) {
            return false;
        }

        try {
            Long userId = jwtService.extractUserId(token);
            attributes.put("principal", new UserIdPrincipal(userId));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request,
                               ServerHttpResponse response,
                               WebSocketHandler wsHandler,
                               Exception exception) {}

    public record UserIdPrincipal(Long userId) implements Principal {
        @Override public String getName() { return String.valueOf(userId); }
    }
}
