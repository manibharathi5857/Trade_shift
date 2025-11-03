import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Portfolio } from './portfolio/portfolio';
import { Register } from './register/register';
// import { Addtrade } from './addtrade/addtrade';


export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'portfolio', component: Portfolio },
  // {path:'addtrade',component:Addtrade}
];
