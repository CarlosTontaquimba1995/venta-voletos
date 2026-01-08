import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { Event, SeatType, PersonalInfo } from '../ticket-purchase-stepper/ticket-purchase-stepper.component';

@Component({
  selector: 'app-confirmation-step',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDividerModule
  ],
  templateUrl: './confirmation-step.component.html',
  styleUrls: ['./confirmation-step.component.scss']
})
export class ConfirmationStepComponent {
  @Input() event: Event | null = null;
  @Input() seatType: SeatType | null = null;
  @Input() quantity: number = 1;
  @Input() personalInfo: PersonalInfo = { name: '', email: '', phone: '' };
  @Input() total: number = 0;

  getFormattedDate(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }
}
