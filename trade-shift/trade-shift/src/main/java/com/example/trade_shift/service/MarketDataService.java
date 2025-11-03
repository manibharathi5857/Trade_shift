package com.example.trade_shift.service;

import com.example.trade_shift.mongo.MarketData;
import com.example.trade_shift.repository.MarketDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MarketDataService {

    private final MarketDataRepository repository;
    private final SimpMessagingTemplate messagingTemplate;

    public MarketDataService(MarketDataRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }


    // Mock data push every 5 seconds
    @Scheduled(fixedRate = 5000)
    public void sendMarketDataUpdates() {
        MarketData data = new MarketData(
                null,
                "DOLLAR",
                List.of("Price increased by 1%", "Trading volume up")
        );
        messagingTemplate.convertAndSend("/topic/market", data);
    }

    // Add new market data
    public MarketData addMarketData(MarketData data) {
        // Optional: prevent duplicates
        Optional<MarketData> existing = repository.findBySymbol(data.getSymbol());
        if (existing.isPresent()) {
            throw new RuntimeException("Market data for symbol already exists: " + data.getSymbol());
        }
        return repository.save(data);
    }

    public Optional<MarketData> getBySymbol(String symbol) {
        return repository.findBySymbol(symbol);
    }

    public MarketData updateMarketData(String symbol, MarketData updatedData) {
        // find existing record or create new one
        MarketData data = repository.findBySymbol(symbol).orElse(new MarketData());
        data.setSymbol(symbol);
        data.setNews(updatedData.getNews());

        // Save to MongoDB
        MarketData saved = repository.save(data);

        // 🔔 Notify all subscribed clients with new data
        messagingTemplate.convertAndSend("/topic/market-updates", saved);

        return saved;
    }
}
