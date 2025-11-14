import { Routes } from '@angular/router';
import { Login } from './login/login';
// import { Portfolio } from './portfolio/portfolio';
import { Register } from './register/register';
import { Trading } from './trading/trading';
import { Portfolio } from './portfolio/portfolio';
import { LiveMarket } from './live-market/live-market';



export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
   { path: 'portfolio', component: Portfolio },
 { path:'trading',component:Trading},
  { path:'live',component:LiveMarket}
  ];
