package com.example.trade_shift.service;

import com.example.trade_shift.mongo.MarketData;
import com.example.trade_shift.repository.MarketDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Random;

@Service
public class MarketDataService {

    private final MarketDataRepository repository;
    private final SimpMessagingTemplate messagingTemplate;
    private final Random random = new Random();

    public MarketDataService(MarketDataRepository repository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.messagingTemplate = messagingTemplate;
    }

    public void saveAndBroadcast(MarketData data) {
        repository.save(data);
        messagingTemplate.convertAndSend("/topic/market", data);
    }

    // Update & send every 1 second
    @Scheduled(fixedRate = 1000)
    public void sendMarketDataUpdates() {
        List<MarketData> dataList = repository.findAll();
        if (dataList.isEmpty()) {
            // create sample if DB empty
            MarketData sample = new MarketData(null, "DOLLAR", List.of("Price stable", "No major changes"), 82.5, System.currentTimeMillis());
            repository.save(sample);
            dataList = List.of(sample);
        }

        for (MarketData data : dataList) {
            // simulate live changes
            double change = (random.nextDouble() - 0.5) * 0.5;
            double newPrice = Math.round((data.getPrice() + change) * 100.0) / 100.0;

            data.setPrice(newPrice);
            data.setNews(List.of("Price updated to " + newPrice, "Change: " + String.format("%.2f", change)));
            data.setTimestamp(System.currentTimeMillis());
            repository.save(data);

            // broadcast to all subscribers
            messagingTemplate.convertAndSend("/topic/market", data);
        }
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
