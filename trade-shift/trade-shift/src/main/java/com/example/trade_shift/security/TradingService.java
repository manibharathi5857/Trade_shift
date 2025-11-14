package com.example.trade_shift.security;


import com.example.trade_shift.model.PortfolioItem;
import com.example.trade_shift.model.Transaction;
import com.example.trade_shift.model.User;
import com.example.trade_shift.repository.PortfolioRepository;
import com.example.trade_shift.repository.TransactionRepository;
import com.example.trade_shift.repository.UserRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;


@Service
public class TradingService {


    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final PortfolioRepository portfolioRepository;


    public TradingService(TransactionRepository transactionRepository, UserRepository userRepository, PortfolioRepository portfolioRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
        this.portfolioRepository = portfolioRepository;
    }


    @Transactional
    public Transaction executeBuyOrder(Long userId, String symbol, Double quantity, Double price) {
        User user = userRepository.findById(userId).orElseThrow();
        double cost = quantity * price;
        if (user.getCashBalance() < cost) throw new RuntimeException("Insufficient funds");
        user.setCashBalance(user.getCashBalance() - cost);
        userRepository.save(user);


// add or update portfolio
        List<PortfolioItem> items = portfolioRepository.findByUserId(userId);
        PortfolioItem found = items.stream().filter(i -> i.getSymbol().equalsIgnoreCase(symbol)).findFirst().orElse(null);
        if (found == null) {
            PortfolioItem pi = new PortfolioItem();
            pi.setUserId(userId);
            pi.setSymbol(symbol);
            pi.setQuantity(quantity);
            portfolioRepository.save(pi);
        } else {
            found.setQuantity(found.getQuantity() + quantity);
            portfolioRepository.save(found);
        }


        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setSymbol(symbol);
        tx.setQuantity(quantity);
        tx.setPrice(price);
        tx.setType("BUY");
        return transactionRepository.save(tx);
    }


    @Transactional
    public Transaction executeSellOrder(Long userId, String symbol, Double quantity, Double price) {
        // 🔍 Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔍 Check portfolio holdings
        List<PortfolioItem> items = portfolioRepository.findByUserId(userId);
        PortfolioItem holding = items.stream()
                .filter(i -> i.getSymbol().equalsIgnoreCase(symbol))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No holdings for symbol: " + symbol));

        // ❌ Check sufficient quantity
        if (holding.getQuantity() < quantity) {
            throw new RuntimeException("Not enough quantity to sell");
        }

        // 💰 Calculate sale value
        double totalSale = quantity * price;

        // 💸 Update portfolio
        holding.setQuantity(holding.getQuantity() - quantity);
        if (holding.getQuantity() <= 0) {
            // Remove holding entirely if quantity = 0
            portfolioRepository.delete(holding);
        } else {
            portfolioRepository.save(holding);
        }

        // 💵 Add money to user cash balance
        user.setCashBalance(user.getCashBalance() + totalSale);
        userRepository.save(user);

        // 🧾 Create and save transaction record
        Transaction tx = new Transaction();
        tx.setUserId(userId);
        tx.setSymbol(symbol);
        tx.setType("SELL");
        tx.setQuantity(quantity);
        tx.setPrice(price);
        tx.setTimestamp(LocalDateTime.now());
        tx.setTotal(totalSale);

        return transactionRepository.save(tx);
    }

}