import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {


   baseUrl = 'http://localhost:8080';
  username = '';
  password = '';
  loginStatus = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    this.http.post<any>(`${this.baseUrl}/api/auth/login`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.token) {
          localStorage.setItem('jwtToken', res.token);
          localStorage.setItem('userId', '1');
          this.loginStatus = '✅ Login successful!';
          this.router.navigate(['/portfolio']);
        } else {
          this.loginStatus = '❌ Login failed!';
        }
      },
      error: () => {
        this.loginStatus = '⚠️ Error during login.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
