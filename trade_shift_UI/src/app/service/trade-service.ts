import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(){
    
  }

    private marketSource = new BehaviorSubject<string>(''); // Live data stream
  currentMarket$ = this.marketSource.asObservable(); // Observable for subscription

  // Call this from AddTrade to send data
  updateMarketData(data: string) {
    this.marketSource.next(data);
  }
  
}
