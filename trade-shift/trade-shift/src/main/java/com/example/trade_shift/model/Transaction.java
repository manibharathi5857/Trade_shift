package com.example.trade_shift.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.time.LocalDateTime;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String symbol;
    private String type; // "BUY" or "SELL"
    private Double quantity;
    private Double price;
    private Double total;

    private LocalDateTime timestamp;
}