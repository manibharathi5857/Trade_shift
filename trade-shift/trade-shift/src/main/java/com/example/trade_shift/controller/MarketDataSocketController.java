package com.example.trade_shift.controller;

import com.example.trade_shift.mongo.MarketData;
import com.example.trade_shift.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class MarketDataSocketController {

    @Autowired
    private MarketDataService service;

    @MessageMapping("/update")
    public void handleUpdate(MarketData data) {
        service.saveAndBroadcast(data);
    }
}
