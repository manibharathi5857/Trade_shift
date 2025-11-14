package com.example.trade_shift.config;



import com.example.trade_shift.security.JwtUtil;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtUtil jwtService;

    public JwtHandshakeInterceptor(JwtUtil jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {

        if (request instanceof ServletServerHttpRequest servletRequest) {
            String authHeader = servletRequest.getServletRequest().getParameter("token");
            if (authHeader == null) {
                authHeader = servletRequest.getServletRequest().getHeader("Authorization");
            }

            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    String username = jwtService.extractUsername(token);
                    attributes.put("username", username);
                    return true; // ✅ valid JWT
                } catch (Exception e) {
                    System.out.println("❌ Invalid JWT token: " + e.getMessage());
                    return false;
                }
            }
        }
        return false;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) { }
}
