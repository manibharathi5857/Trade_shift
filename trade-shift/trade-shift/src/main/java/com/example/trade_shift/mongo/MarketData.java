package com.example.trade_shift.mongo;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "market_data")
public class MarketData {
    @Id
    private String id;
    private String symbol;
    private List<String> news;
    private double price;
    private long timestamp;
}