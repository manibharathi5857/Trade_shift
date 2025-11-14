package com.example.trade_shift.controller;

import com.example.trade_shift.mongo.MarketData;
import com.example.trade_shift.service.MarketDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/marketdata")
public class MarketDataController {

    private final MarketDataService marketDataService;

    public MarketDataController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<?> getBySymbol(@PathVariable String symbol) {
        return marketDataService.getBySymbol(symbol)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/add")
    public ResponseEntity<?> addMarketData(@RequestBody MarketData marketData) {
        try {
            MarketData saved = marketDataService.addMarketData(marketData);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}