package com.example.trade_shift.controller;

import com.example.trade_shift.mongo.MarketData;
import com.example.trade_shift.service.MarketDataService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/marketdata/update")
public class MarketDataUpdateController {

    private final MarketDataService marketDataService;

    public MarketDataUpdateController(MarketDataService marketDataService) {
        this.marketDataService = marketDataService;
    }

    @PutMapping("/{symbol}")
    public ResponseEntity<?> updateData(@PathVariable String symbol, @RequestBody MarketData updated) {
        MarketData saved = marketDataService.updateMarketData(symbol, updated);
        return ResponseEntity.ok(saved);
    }
}
