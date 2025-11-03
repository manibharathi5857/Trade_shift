import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { TradeService } from '../service/trade-service';

Chart.register(...registerables);

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './portfolio.html',
  styleUrls: ['./portfolio.scss'],
})
export class Portfolio implements OnInit, OnDestroy {
  baseUrl = 'http://localhost:8080';
  portfolio?: any;
  transactions: any = [];

  tradeSymbol = '';
  tradeQuantity: number | null = null;
  tradePrice: number | null = null;
  tradeStatus = '';

  private refreshSub?: Subscription;
  private chart?: Chart;
  liveUpdate: any = '82,908.00';
  private intervalId: any;
  liveGoldUpdate:any='$667.00'
  private previousValue: number = 82908.0;
  priceColor: string = 'black';

  constructor(private http: HttpClient, private router: Router, private marketService: TradeService) {}

  // 🔁 Simulated live market price update
  autoUpdateLiveValue() {
    const value = parseFloat(this.liveUpdate.replace(/,/g, ''));
    const randomChange = (Math.random() - 0.5) * 100; // +/- 50 change
    const newValue = Math.max(0, value + randomChange);

    // Change color based on direction
    this.priceColor = newValue > this.previousValue ? 'green' : 'red';
    this.previousValue = newValue;

    this.liveGoldUpdate = newValue.toLocaleString('en-US', {
      minimumFractionDigits: 9,
      maximumFractionDigits: 8,
    });

    this.liveUpdate = newValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  // 🕒 Wait until userId is available, then load portfolio
  waitForUserIdAndLoad() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.loadPortfolio();
      this.loadTransactions();
    } else {
      console.warn('⚠️ Waiting for userId...');
      setTimeout(() => this.waitForUserIdAndLoad(), 500);
    }
  }


  
  ngOnInit() {


    setTimeout(()=>{
    let e = "1"

        this.http.get(`${this.baseUrl}/api/portfolio/${e}`, { headers: this.getHeaders() }).subscribe({
      next:(data)=>{
        this.assetData= data
      },
      error:(err)=>{
        
      }
    })
    },1000)


    // 🟢 Start simulated market update
    this.intervalId = setInterval(() => {
      this.autoUpdateLiveValue();

    }, 1000);
    setTimeout(()=>{
      this.tradeSymbol="d"
        },1000)

    // 🟢 Load portfolio data automatically when component loads
    this.waitForUserIdAndLoad();

    // 🟢 Subscribe to live market updates (real-time updates via service)
    this.marketService.currentMarket$.subscribe((data) => {
      if (data) {
        this.liveUpdate = data;
      }
    });

    // 🔁 Auto refresh every 10 seconds
    this.refreshSub = interval(10000).subscribe(() => {
      this.loadPortfolio();
      this.loadTransactions();
    });
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
    this.chart?.destroy();

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      'Content-Type': 'application/json',
    });
  }

  loadPortfolio() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.http.get(`${this.baseUrl}/api/portfolio/${userId}`, { headers: this.getHeaders() })
      .subscribe({
        next: (res: any) => {
          this.portfolio = res;
          this.updateChart(); // 📊 Update chart when data changes
        },
        error: () => console.error('❌ Failed to load portfolio'),
      });
  }

  loadTransactions() {
    const userId = localStorage.getItem('userId');
    
 

    this.http.get(`${this.baseUrl}/api/trades/transactions/${userId}`, { headers: this.getHeaders() })
      .subscribe({
        next: (res) => this.transactions = res,
        error: () => console.error('❌ Failed to load transactions'),
      });
  }

  // 📊 Chart.js - Create or Update Portfolio Chart
  updateChart() {
    if (!this.portfolio?.holdings) return;

    const ctx = document.getElementById('portfolioChart') as HTMLCanvasElement;
    const labels = this.portfolio.holdings.map((h: any) => h.symbol);
    const data = this.portfolio.holdings.map((h: any) => h.quantity * h.avgPrice);

    if (this.chart) {
      // Update existing chart
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = data;
      this.chart.update();
      return;
    }

    // Create new chart if not exists
    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          {
            label: 'Portfolio Value',
            data,
            backgroundColor: [
              '#36A2EB',
              '#FF6384',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40'
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Portfolio Holdings Distribution',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  // 🟢 Buy Asset
  buyAsset() {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.tradeSymbol || !this.tradeQuantity || !this.tradePrice) {
      this.tradeStatus = '⚠️ Please fill all trade fields';
      return;
    }

    const payload = {
      userId,
      symbol: this.tradeSymbol,
      quantity: Number(this.tradeQuantity),
      price: Number(this.tradePrice),
    };

    this.http.post(`${this.baseUrl}/api/trades/buy`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.tradeStatus = '✅ Buy order executed!';
          this.loadPortfolio();
        },
        error: () => this.tradeStatus = '⚠️ Buy order failed.',
      });
  }

assetData:any=[]
  getId(e:any){
    console.log(e)
    this.http.get(`${this.baseUrl}/api/portfolio/${e}`, { headers: this.getHeaders() }).subscribe({
      next:(data)=>{
        this.assetData= data
      },
      error:(err)=>{

      }
    })


  }

  // 🔴 Sell Asset
  sellAsset() {
    const userId = localStorage.getItem('userId');
    if (!userId || !this.tradeSymbol || !this.tradeQuantity || !this.tradePrice) {
      this.tradeStatus = '⚠️ Please fill all trade fields';
      return;
    }

    const payload = {
      userId,
      symbol: this.tradeSymbol,
      quantity: Number(this.tradeQuantity),
      price: Number(this.tradePrice),
    };

    this.http.post(`${this.baseUrl}/api/trades/sell`, payload, { headers: this.getHeaders() })
      .subscribe({
        next: () => {
          this.tradeStatus = '✅ Sell order executed!';
          this.loadPortfolio();
        },
        error: () => this.tradeStatus = '⚠️ Sell order failed.',
      });
  }
}
