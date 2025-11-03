package com.example.trade_shift.repository;

import com.example.trade_shift.mongo.MarketData;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;


public interface MarketDataRepository extends MongoRepository<MarketData, String> {
    Optional<MarketData> findBySymbol(String symbol);
}