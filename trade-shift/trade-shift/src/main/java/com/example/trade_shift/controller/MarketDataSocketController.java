package com.example.trade_shift.controller;

import com.example.trade_shift.mongo.MarketData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MarketDataSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Client sends message to /app/update
    @MessageMapping("/update")
    public void handleUpdate(MarketData data) {
        // Broadcast to all subscribers of /topic/market
        messagingTemplate.convertAndSend("/topic/market", data);
    }
}
