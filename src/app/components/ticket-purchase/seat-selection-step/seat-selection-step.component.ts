import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SeatType } from '../ticket-purchase-stepper/ticket-purchase-stepper.component';

@Component({
  selector: 'app-seat-selection-step',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './seat-selection-step.component.html',
  styleUrls: ['./seat-selection-step.component.scss']
})
export class SeatSelectionStepComponent {
  @Input() seatTypes: SeatType[] = [];
  @Input() selectedSeatType: SeatType | null = null;
  @Input() quantity: number = 1;
  @Output() seatSelected = new EventEmitter<SeatType>();
  @Output() quantityChange = new EventEmitter<number>();

  onSeatSelect(seatType: SeatType): void {
    this.seatSelected.emit(seatType);
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      this.quantityChange.emit(value);
    }
  }
}
