import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Event, SeatType, PersonalInfo } from '../ticket-purchase-stepper/ticket-purchase-stepper.component';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  paymentMethod: string;
}

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './confirmation-step.component.html',
  styleUrls: ['./confirmation-step.component.scss']
})
export class ConfirmationStepComponent implements OnInit, OnChanges {
  @Input() event: Event | null = null;
  @Input() seatType: SeatType | null = null;
  @Input() quantity: number = 1;
  @Input() personalInfo: PersonalInfo = { name: '', email: '', phone: '' };
  orderNumber: string = '';
  orderDetails: OrderDetails = {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0
  };

  customerInfo: CustomerInfo = {
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'Tarjeta de crédito terminada en 4242'
  };

  ngOnInit(): void {
    this.generateOrderNumber();
    this.updateOrderDetails();
    this.prepareCustomerInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['seatType'] || changes['quantity']) && this.seatType) {
      this.updateOrderDetails();
    }
    if (changes['personalInfo']) {
      this.prepareCustomerInfo();
    }
  }

  private updateOrderDetails(): void {
    if (this.seatType) {
      this.prepareOrderDetails();
    }
  }

  private generateOrderNumber(): void {
    // Generate a random order number (in a real app, this would come from the server)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    this.orderNumber = `ORD-${randomNum}`;
  }

  private prepareOrderDetails(): void {
    if (this.seatType) {
      const subtotal = this.seatType.price * this.quantity;
      const tax = subtotal;
      const total = subtotal + tax;

      this.orderDetails = {
        items: [{
          name: this.seatType.name,
          quantity: this.quantity,
          price: this.seatType.price
        }],
        subtotal: subtotal,
        tax: tax,
        total: total
      };
    }
  }

  private prepareCustomerInfo(): void {
    this.customerInfo = {
      ...this.personalInfo,
      paymentMethod: 'Tarjeta de crédito terminada en 4242'
    };
  }

  downloadTickets(): void {
    // In a real app, this would trigger a download of the tickets
    console.log('Downloading tickets...');
    // Implement actual download logic here
  }

  sendToEmail(): void {
    // In a real app, this would send the tickets to the user's email
    console.log('Sending tickets to email...');
    // Implement actual email sending logic here
  }

  getFormattedDate(dateString: string): string {
    if (!dateString) return '';

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Bogota'
    };

    try {
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  }
}
