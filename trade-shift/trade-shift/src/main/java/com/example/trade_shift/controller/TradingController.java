package com.example.trade_shift.controller;

import com.example.trade_shift.model.Transaction;
import com.example.trade_shift.repository.PortfolioRepository;
import com.example.trade_shift.repository.TransactionRepository;

import com.example.trade_shift.security.TradingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trades")
public class TradingController {

    private final TradingService tradingService;
    private final TransactionRepository transactionRepository;
    private final PortfolioRepository portfolioRepository;

    public TradingController(TradingService tradingService,
                             TransactionRepository transactionRepository,
                             PortfolioRepository portfolioRepository) {
        this.tradingService = tradingService;
        this.transactionRepository = transactionRepository;
        this.portfolioRepository = portfolioRepository;
    }

    @PostMapping("/buy")
    public ResponseEntity<Transaction> buy(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String symbol = body.get("symbol").toString();
        Double quantity = Double.valueOf(body.get("quantity").toString());
        Double price = Double.valueOf(body.get("price").toString());
        Transaction tx = tradingService.executeBuyOrder(userId, symbol, quantity, price);
        return ResponseEntity.ok(tx);
    }

    @PostMapping("/sell")
    public ResponseEntity<Transaction> sell(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        String symbol = body.get("symbol").toString();
        Double quantity = Double.valueOf(body.get("quantity").toString());
        Double price = Double.valueOf(body.get("price").toString());
        Transaction tx = tradingService.executeSellOrder(userId, symbol, quantity, price);
        return ResponseEntity.ok(tx);
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<Transaction>> transactions(@PathVariable Long userId) {
        return ResponseEntity.ok(transactionRepository.findByUserIdOrderByTimestampDesc(userId));
    }
}
