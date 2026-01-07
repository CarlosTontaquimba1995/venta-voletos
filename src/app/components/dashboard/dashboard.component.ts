import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        NavbarComponent
    ],
    template: `
    <div class="dashboard">
      <app-navbar></app-navbar>
      <div class="container mt-4">
        <h1>Welcome to Dashboard</h1>
        <p>This is a protected route. Only authenticated users can see this page.</p>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
    styles: [`
    .dashboard {
      min-height: 100vh;
      background-color: #f8f9fa;
    }
  `]
})
export class DashboardComponent { }
