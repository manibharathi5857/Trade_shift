package com.example.trade_shift.controller;


import com.example.trade_shift.model.PortfolioItem;
import com.example.trade_shift.repository.PortfolioRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {


    private final PortfolioRepository portfolioRepository;


    public PortfolioController(PortfolioRepository portfolioRepository) {
        this.portfolioRepository = portfolioRepository;
    }


    @GetMapping("/{userId}")
    public ResponseEntity<List<PortfolioItem>> getPortfolio(@PathVariable Long userId) {
        return ResponseEntity.ok(portfolioRepository.findByUserId(userId));
    }
}