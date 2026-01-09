import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Event, SeatType, PersonalInfo } from '../ticket-purchase-stepper/ticket-purchase-stepper.component';
import { TicketResponse } from '../../../services/ticket.service';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  type: string;
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

export interface SelectedSeatType {
  seatType: SeatType;
  quantity: number;
}

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './confirmation-step.component.html',
  styleUrls: ['./confirmation-step.component.scss']
})
export class ConfirmationStepComponent implements OnInit, OnChanges {
  constructor(private snackBar: MatSnackBar) { }
  @Input() event: Event | null = null;
  @Input() selectedSeats: { seatType: SeatType, quantity: number }[] = [];
  @Input() personalInfo: PersonalInfo = { name: '', email: '', phone: '' };

  // Ticket response from the server
  _ticketResponse: TicketResponse | null = null;

  @Input()
  set ticketResponse(value: TicketResponse | null) {
    this._ticketResponse = value;
    if (value) {
      this.showSuccessMessage();
    }
  }

  get ticketResponse(): TicketResponse | null {
    return this._ticketResponse;
  }

  orderNumber: string = '';
  isLoading = false;
  showTicketDetails = false;
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
    this.updateCustomerInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedSeats'] || changes['event']) {
      this.updateOrderDetails();
    }
    if (changes['personalInfo']) {
      this.updateCustomerInfo();
    }
  }

  private generateOrderNumber(): void {
    // Generate a random order number (in a real app, this would come from the server)
    this.orderNumber = 'ORD-' + Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private updateCustomerInfo(): void {
    this.customerInfo = {
      name: this.personalInfo.name,
      email: this.personalInfo.email,
      phone: this.personalInfo.phone,
      paymentMethod: 'Tarjeta de crédito terminada en 4242'
    };
  }

  private updateOrderDetails(): void {
    if (this.selectedSeats && this.selectedSeats.length > 0) {
      const items = this.selectedSeats
        .filter(item => item.quantity > 0)
        .map(item => ({
          name: item.seatType.name,
          quantity: item.quantity,
          price: item.seatType.price,
          type: item.seatType.id
        }));

      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      this.orderDetails = {
        items: items,
        subtotal: subtotal,
        tax: 0,
        total: subtotal
      };
    } else {
      this.orderDetails = {
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0
      };
    }
  }

  private showSuccessMessage(): void {
    this.snackBar.open('¡Compra realizada con éxito!', 'Cerrar', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  downloadTickets(): void {
    if (!this.ticketResponse?.ticket) {
      this.snackBar.open('No hay tickets para descargar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading = true;

    // In a real app, this would trigger a download of the tickets
    console.log('Downloading tickets...', this.ticketResponse);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.snackBar.open('Descarga completada', 'Cerrar', {
        duration: 3000
      });
    }, 1500);
  }

  sendToEmail(): void {
    if (!this.ticketResponse?.ticket) {
      this.snackBar.open('No hay tickets para enviar', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    this.isLoading = true;

    // In a real app, this would send the tickets to the user's email
    console.log('Sending tickets to email...', this.ticketResponse);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.snackBar.open('Tickets enviados al correo electrónico', 'Cerrar', {
        duration: 3000
      });
    }, 1500);
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
