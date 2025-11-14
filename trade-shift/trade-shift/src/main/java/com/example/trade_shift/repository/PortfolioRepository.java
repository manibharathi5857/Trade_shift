package com.example.trade_shift.repository;

import com.example.trade_shift.model.PortfolioItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface PortfolioRepository extends JpaRepository<PortfolioItem, Long> {
    List<PortfolioItem> findByUserId(Long userId);
}
