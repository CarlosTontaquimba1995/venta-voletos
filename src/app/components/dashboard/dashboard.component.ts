import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TicketPurchaseStepperComponent } from '../ticket-purchase/ticket-purchase-stepper/ticket-purchase-stepper.component';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
      NavbarComponent,
      TicketPurchaseStepperComponent
    ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent { }
