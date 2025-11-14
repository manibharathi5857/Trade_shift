package com.example.trade_shift.model;

import jakarta.persistence.*;

import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(unique = true, nullable = false)
    private String username;


    @Column(nullable = false)
    private String password;


    private Double cashBalance = 100000.0;
}
