import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';

@Component({
  selector: 'app-live-market',
  imports: [CommonModule,],
  templateUrl: './live-market.html',
  styleUrl: './live-market.css',
})
export class LiveMarket {

  status: string = '🔴 Disconnected';
  connected = false;
  dataLoaded = false;

  symbol: string = '';
  price: number = 0;
  news: string[] = [];
  timestamp: string = '';

  stompClient!: Client;

  ngOnInit(): void {
    this.connectWebSocket();
  }

  connectWebSocket(): void {
    const token = localStorage.getItem('jwt') || 'demo-token';

    this.stompClient = new Client({
      reconnectDelay: 5000,
      debug: (msg) => console.log(msg),
      onConnect: () => {
        console.log('✅ Connected to WebSocket');
        this.connected = true;
        this.status = '🟢 Connected';

        this.stompClient.subscribe('/topic/market', (message: IMessage) => {
          const data = JSON.parse(message.body);
          console.log('📦 Data received:', data);
          this.updateUI(data);
        });
      },
      onDisconnect: () => {
        console.log('🔌 Disconnected');
        this.connected = false;
        this.status = '🔴 Disconnected';
      }
    });

    this.stompClient.activate();
  }

  updateUI(data: any): void {
    this.dataLoaded = true;
    this.symbol = data.symbol;
    this.price = parseFloat(data.price).toFixed(2) as any;
    this.timestamp = new Date(data.timestamp).toLocaleTimeString();
    this.news = data.news;
  }

  sendTestUpdate(): void {
    if (this.stompClient && this.stompClient.connected) {
      const testData = {
        symbol: 'DOLLAR',
        news: ['Client-side test update'],
        price: (Math.random() * 100).toFixed(2),
        timestamp: Date.now()
      };
      this.stompClient.publish({
        destination: '/app/update',
        body: JSON.stringify(testData)
      });
      console.log('📤 Sent:', testData);
    } else {
      alert('WebSocket not connected!');
    }
  }

  ngOnDestroy(): void {
    if (this.stompClient) this.stompClient.deactivate();
  }
}
