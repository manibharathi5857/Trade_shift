// import { CommonModule } from '@angular/common';
// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { TradeService } from '../service/trade-service';
// // import SockJS from 'sockjs-client';

// @Component({
//   selector: 'app-addtrade',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './addtrade.html',
//   styleUrls: ['./addtrade.scss'],
// })
// export class Addtrade implements OnInit, OnDestroy {
//   private socket!: WebSocket;
//   marketData: any =""

//   constructor(private marketService: TradeService){

//   }

//   ngOnInit(): void {
//     this.connect();
//   }

//   ngOnDestroy(): void {
//     if (this.socket) {
//       this.socket.close();
//       console.log('WebSocket disconnected');
//     }
//   }

//   connect() {
//     // Connect using SockJS
//    // this.socket = new SockJS('http://localhost:8080/ws/market') as unknown as WebSocket;

//     this.socket.onopen = () => {
//       console.log('Connected to WebSocket');
//     };

//     this.socket.onmessage = (event) => {
//       console.log('Message received:', event.data);
//       try {
//         this.marketData = JSON.parse(event.data);
//       } catch (err) {
//         console.warn('Received non-JSON message:', event.data);
//       }
//     };

//     this.socket.onclose = () => {
//       console.log('Disconnected, retrying...');
//       setTimeout(() => this.connect(), 5000);
//     };

//     this.socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };
//   }

//   // Example method to send a message
//   sendData() {
//     if (this.socket && this.socket.readyState === WebSocket.OPEN) {
//       const data = {
//         symbol: 'USD',
//         news: ['Price increased by 2%', 'Trading volume high'],
//       };
//       this.socket.send(JSON.stringify(data));
//     }
//   }
//   tradeValue: string = '';

//     sendUpdate() {
//     if (this.tradeValue.trim()) {
//       this.marketService.updateMarketData(this.tradeValue);
//       this.tradeValue = ''; // clear box
//     }
//   }
// }
