import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { trigger, state, style, animate, transition } from '@angular/animations';
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
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './seat-selection-step.component.html',
  styleUrls: ['./seat-selection-step.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SeatSelectionStepComponent implements OnInit {
  @Input() seatTypes: SeatType[] = [];
  @Input() selectedSeatType: SeatType | null = null;
  @Input() quantity: number = 0;
  @Output() seatSelected = new EventEmitter<SeatType>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() quantityChanged = new EventEmitter<number>();

  // Track quantities for each seat type
  seatQuantities: { [key: string]: number } = {};

  // Default seat types if not provided
  defaultSeatTypes: SeatType[] = [
    {
      id: 'vip',
      name: 'VIP',
      description: 'Las más cercanas al escenario, incluyen beneficios exclusivos como bebidas y accesos rápidos.',
      price: 150,
      available: true,
      icon: 'star'
    },
    {
      id: 'preferente',
      name: 'Preferente / Gold',
      description: 'Ubicación central con excelente visibilidad del escenario.',
      price: 100,
      available: true,
      icon: 'grade'
    },
    {
      id: 'general',
      name: 'General / Platea',
      description: 'Zona estándar con buena visibilidad, ubicada en la parte media del recinto.',
      price: 60,
      available: true,
      icon: 'event_seat'
    }
  ];

  ngOnInit(): void {
    // Use provided seat types or default ones if none provided
    if (this.seatTypes.length === 0) {
      this.seatTypes = [...this.defaultSeatTypes];
    }
  }

  onSeatSelect(seatType: SeatType): void {
    const isNewSelection = this.selectedSeatType?.id !== seatType.id;
    this.selectedSeatType = seatType;

    // Initialize quantity for this seat type if it doesn't exist
    if (!this.seatQuantities[seatType.id]) {
      this.seatQuantities[seatType.id] = 0;
    }

    // Update the current quantity to match the selected seat
    this.quantity = this.seatQuantities[seatType.id];
    this.quantityChanged.emit(this.quantity);

    this.seatSelected.emit(seatType);
  }

  onQuantityChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 10) {
      this.quantity = value;
      this.quantityChange.emit(value);
    } else {
      // Reset to previous valid value
      input.value = this.quantity.toString();
    }
  }

  getTotalPrice(): number {
    if (!this.selectedSeatType) return 0;

    // Calculate total price for all selected seats
    return Object.entries(this.seatQuantities).reduce((total, [seatId, qty]) => {
      const seat = this.seatTypes.find(s => s.id === seatId);
      return total + (seat ? seat.price * qty : 0);
    }, 0);
  }

  incrementQuantity(): void {
    if (this.selectedSeatType && this.quantity < 10) {
      this.quantity++;
      this.seatQuantities[this.selectedSeatType.id] = this.quantity;
      this.quantityChanged.emit(this.quantity);
    }
  }

  decrementQuantity(): void {
    if (this.selectedSeatType && this.quantity > 0) {
      this.quantity--;
      this.seatQuantities[this.selectedSeatType.id] = this.quantity;
      this.quantityChanged.emit(this.quantity);
    }
  }

  onQuantityKeydown(event: KeyboardEvent): void {
    // Prevent typing non-numeric characters
    if (['e', 'E', '+', '-', '.'].includes(event.key)) {
      event.preventDefault();
    }
  }
}
