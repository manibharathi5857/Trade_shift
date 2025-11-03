import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [CommonModule,FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  baseUrl = 'http://localhost:8080';
  username = '';
  password = '';
  registerStatus = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    this.http.post(`${this.baseUrl}/api/auth/register`, {
      username: this.username,
      password: this.password
    }).subscribe({
      next: () => {
        this.registerStatus = '✅ Registration successful! You can now log in.';
        this.router.navigate(['/login']);
      },
      error: () => this.registerStatus = '⚠️ Registration failed.'
    });
  }
}
