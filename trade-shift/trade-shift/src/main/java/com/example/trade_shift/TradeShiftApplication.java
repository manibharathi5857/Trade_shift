package com.example.trade_shift;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class TradeShiftApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradeShiftApplication.class, args);
	}

}
