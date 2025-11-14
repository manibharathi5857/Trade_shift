import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  lastUpdated: Date;
}

interface Order {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELLED';
  timestamp: Date;
}

interface Position {
  symbol: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}


@Component({
  selector: 'app-trading',
  imports: [CommonModule,FormsModule],
  templateUrl: './trading.html',
  styleUrl: './trading.scss',
})
export class Trading {
  private destroy$ = new Subject<void>();
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  // State
  isConnected = false;
  stocks: Stock[] = [];
  watchlist: string[] = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
  selectedStock: Stock | null = null;
  orders: Order[] = [];
  positions: Position[] = [];
  
  // Order form
  orderType: 'BUY' | 'SELL' = 'BUY';
  orderQuantity = 1;
  orderPrice = 0;

  // UI State
  activeTab: 'positions' | 'orders' = 'positions';

  // Portfolio summary
  totalInvestment = 50000;
  currentValue = 50000;
  totalPnL = 0;
  totalPnLPercent = 0;

  ngOnInit() {
    this.connectWebSocket();
    this.loadMockData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.disconnectWebSocket();
  }

  connectWebSocket() {
    // Using a public WebSocket echo server for demo
    // Replace with your actual trading API WebSocket URL
    const wsUrl = 'wss://echo.websocket.org/';
    
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.subscribeToStocks();
      };

      this.ws.onmessage = (event) => {
        this.handleWebSocketMessage(event.data);
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnected = false;
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.startMockDataStream();
    }
  }

  disconnectWebSocket() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      setTimeout(() => this.connectWebSocket(), 3000);
    } else {
      console.log('Max reconnection attempts reached. Starting mock data stream.');
      this.startMockDataStream();
    }
  }

  subscribeToStocks() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const subscribeMsg = JSON.stringify({
        action: 'subscribe',
        symbols: this.watchlist
      });
      this.ws.send(subscribeMsg);
    }
  }

  handleWebSocketMessage(data: string) {
    try {
      const message = JSON.parse(data);
      
      if (message.type === 'quote') {
        this.updateStockPrice(message);
      } else if (message.type === 'order_update') {
        this.updateOrder(message);
      }
    } catch (error) {
      // If parsing fails, start mock data for demo
      this.startMockDataStream();
    }
  }

  startMockDataStream() {
    // Simulate real-time price updates for demo purposes
    setInterval(() => {
      this.stocks.forEach(stock => {
        const changePercent = (Math.random() - 0.5) * 2;
        const priceChange = stock.price * (changePercent / 100);
        
        stock.price += priceChange;
        stock.change += priceChange;
        stock.changePercent = (stock.change / (stock.price - stock.change)) * 100;
        stock.lastUpdated = new Date();
        
        // Update high/low
        if (stock.price > stock.high) stock.high = stock.price;
        if (stock.price < stock.low) stock.low = stock.price;
        
        // Random volume
        stock.volume += Math.floor(Math.random() * 1000);
      });

      this.updatePositions();
    }, 1000);
  }

  loadMockData() {
    // Initialize stocks
    this.stocks = [
      {
        symbol: 'AAPL',
        name: 'Apple Inc.',
        price: 178.50,
        change: 2.35,
        changePercent: 1.33,
        high: 179.80,
        low: 176.20,
        volume: 52340000,
        lastUpdated: new Date()
      },
      {
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        price: 142.80,
        change: -1.20,
        changePercent: -0.83,
        high: 144.50,
        low: 141.90,
        volume: 28450000,
        lastUpdated: new Date()
      },
      {
        symbol: 'MSFT',
        name: 'Microsoft Corp.',
        price: 378.90,
        change: 4.50,
        changePercent: 1.20,
        high: 380.20,
        low: 374.50,
        volume: 31250000,
        lastUpdated: new Date()
      },
      {
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        price: 242.80,
        change: -3.40,
        changePercent: -1.38,
        high: 247.50,
        low: 241.20,
        volume: 98760000,
        lastUpdated: new Date()
      },
      {
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        price: 178.35,
        change: 1.85,
        changePercent: 1.05,
        high: 179.50,
        low: 176.80,
        volume: 45320000,
        lastUpdated: new Date()
      }
    ];

    // Initialize positions
    this.positions = [
      {
        symbol: 'AAPL',
        quantity: 10,
        avgPrice: 175.00,
        currentPrice: 178.50,
        pnl: 35.00,
        pnlPercent: 2.00
      },
      {
        symbol: 'MSFT',
        quantity: 5,
        avgPrice: 370.00,
        currentPrice: 378.90,
        pnl: 44.50,
        pnlPercent: 2.41
      }
    ];

    this.selectedStock = this.stocks[0];
    this.orderPrice = this.selectedStock.price;
    this.calculatePortfolio();
    this.startMockDataStream();
  }

  updateStockPrice(data: any) {
    const stock = this.stocks.find(s => s.symbol === data.symbol);
    if (stock) {
      stock.price = data.price;
      stock.change = data.change;
      stock.changePercent = data.changePercent;
      stock.lastUpdated = new Date();
    }
    this.updatePositions();
  }

  updatePositions() {
    this.positions.forEach(pos => {
      const stock = this.stocks.find(s => s.symbol === pos.symbol);
      if (stock) {
        pos.currentPrice = stock.price;
        pos.pnl = (pos.currentPrice - pos.avgPrice) * pos.quantity;
        pos.pnlPercent = ((pos.currentPrice - pos.avgPrice) / pos.avgPrice) * 100;
      }
    });
    this.calculatePortfolio();
  }

  selectStock(stock: Stock) {
    this.selectedStock = stock;
    this.orderPrice = stock.price;
  }

  placeOrder() {
    if (!this.selectedStock || this.orderQuantity <= 0 || this.orderPrice <= 0) {
      alert('Please enter valid quantity and price');
      return;
    }

    const totalCost = this.orderQuantity * this.orderPrice;
    
    // Check if user has enough balance for BUY orders
    if (this.orderType === 'BUY' && totalCost > this.totalInvestment) {
      alert('Insufficient balance for this order');
      return;
    }

    // Check if user has enough quantity for SELL orders
    if (this.orderType === 'SELL') {
      const position = this.positions.find(p => p.symbol === this.selectedStock!.symbol);
      if (!position || position.quantity < this.orderQuantity) {
        alert('Insufficient quantity to sell');
        return;
      }
    }

    const order: Order = {
      id: `ORD${Date.now()}`,
      symbol: this.selectedStock.symbol,
      type: this.orderType,
      quantity: this.orderQuantity,
      price: this.orderPrice,
      status: 'PENDING',
      timestamp: new Date()
    };

    this.orders.unshift(order);

    // Simulate order execution
    setTimeout(() => {
      order.status = 'EXECUTED';
      this.executeOrder(order);
      
      // Switch to orders tab to show the executed order
      this.activeTab = 'orders';
    }, 1000);

    // Send order via WebSocket if connected
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'place_order',
        order: order
      }));
    }
  }

  executeOrder(order: Order) {
    const existingPosition = this.positions.find(p => p.symbol === order.symbol);
    
    if (order.type === 'BUY') {
      // Deduct from investment
      this.totalInvestment -= order.price * order.quantity;
      
      if (existingPosition) {
        const totalCost = existingPosition.avgPrice * existingPosition.quantity + order.price * order.quantity;
        existingPosition.quantity += order.quantity;
        existingPosition.avgPrice = totalCost / existingPosition.quantity;
      } else {
        const stock = this.stocks.find(s => s.symbol === order.symbol);
        this.positions.push({
          symbol: order.symbol,
          quantity: order.quantity,
          avgPrice: order.price,
          currentPrice: stock?.price || order.price,
          pnl: 0,
          pnlPercent: 0
        });
      }
    } else if (order.type === 'SELL' && existingPosition) {
      // Add to investment
      this.totalInvestment += order.price * order.quantity;
      
      existingPosition.quantity -= order.quantity;
      if (existingPosition.quantity <= 0) {
        this.positions = this.positions.filter(p => p.symbol !== order.symbol);
      }
    }

    this.calculatePortfolio();
  }

  calculatePortfolio() {
    this.currentValue = this.positions.reduce((sum, pos) => 
      sum + (pos.currentPrice * pos.quantity), 0
    );
    
    this.totalPnL = this.positions.reduce((sum, pos) => sum + pos.pnl, 0);
    this.totalPnLPercent = this.totalInvestment > 0 
      ? (this.totalPnL / this.totalInvestment) * 100 
      : 0;
  }

  updateOrder(data: any) {
    const order = this.orders.find(o => o.id === data.orderId);
    if (order) {
      order.status = data.status;
    }
  }

  cancelOrder(order: Order) {
    if (order.status === 'PENDING') {
      order.status = 'CANCELLED';
    }
  }

  addToWatchlist(symbol: string) {
    if (!this.watchlist.includes(symbol)) {
      this.watchlist.push(symbol);
      this.subscribeToStocks();
    }
  }

  removeFromWatchlist(symbol: string) {
    this.watchlist = this.watchlist.filter(s => s !== symbol);
  }
}
