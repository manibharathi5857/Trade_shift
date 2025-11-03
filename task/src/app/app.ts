import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
 
}
