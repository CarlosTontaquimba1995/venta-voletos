import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from "@angular/material/divider";

// Step Components
import { EventSelectionStepComponent } from '../event-selection-step/event-selection-step.component';
import { SeatSelectionStepComponent } from '../seat-selection-step/seat-selection-step.component';
import { PersonalInfoStepComponent } from '../personal-info-step/personal-info-step.component';
import { ConfirmationStepComponent } from '../confirmation-step/confirmation-step.component';

export interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
}

export interface SeatType {
  id: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
  icon?: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
}

// Export types for use in step components
export type { Event as IEvent };
export type { SeatType as ISeatType };
export type { PersonalInfo as IPersonalInfo };

@Component({
  selector: 'app-ticket-purchase-stepper',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDividerModule,
    // Step Components
    EventSelectionStepComponent,
    SeatSelectionStepComponent,
    PersonalInfoStepComponent,
    ConfirmationStepComponent
  ],
  templateUrl: './ticket-purchase-stepper.component.html',
  styleUrls: ['./ticket-purchase-stepper.component.scss']
})
export class TicketPurchaseStepperComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  isLinear = true;
  isCompleted = false;

  // Form groups for each step
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  // Data to pass between steps
  selectedEvent: Event | null = null;
  selectedSeatType: SeatType | null = null;
  quantity: number = 1;
  personalInfo: PersonalInfo = {
    name: '',
    email: '',
    phone: ''
  };

  // Mock data
  events: Event[] = [
    { id: 1, name: 'Concierto de Rock', date: '2023-12-25', location: 'Estadio Olímpico' },
    { id: 2, name: 'Festival de Jazz', date: '2023-12-30', location: 'Teatro Nacional' },
    { id: 3, name: 'Partido de Fútbol', date: '2024-01-05', location: 'Estadio Monumental' }
  ];

  seatTypes: SeatType[] = [
    { id: 'general', name: 'General', price: 50, available: true },
    { id: 'vip', name: 'VIP', price: 100, available: true },
    { id: 'platino', name: 'Platino', price: 150, available: true }
  ];

  constructor(private formBuilder: FormBuilder, private cdRef: ChangeDetectorRef) {
    this.firstFormGroup = this.formBuilder.group({
      event: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      seatType: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.thirdFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
    });
  }

  onQuantityChange(quantity: number): void {
    if (quantity >= 1 && quantity <= 10) {
      this.quantity = quantity;
      this.secondFormGroup.get('quantity')?.setValue(quantity, { emitEvent: true });
      this.cdRef.detectChanges(); // Force change detection
    }
  }

  goToNextStep(): void {
    if (this.stepper) {
      this.stepper.next();
    }
  }

  onEventSelected(event: Event): void {
    this.selectedEvent = event;
    this.firstFormGroup.patchValue({ event: event.id });
    this.goToNextStep();
  }

  onSeatSelected(seatType: SeatType): void {
    this.selectedSeatType = seatType;
    this.quantity = 1; // Ensure quantity is set to 1 on seat selection
    this.secondFormGroup.patchValue({
      seatType: seatType.id,
      quantity: 1
    }, { emitEvent: true }); // Ensure change detection is triggered
    this.cdRef.detectChanges(); // Force change detection
  }

  onPersonalInfoSubmit(): void {
    if (this.thirdFormGroup.valid) {
      this.personalInfo = {
        ...this.thirdFormGroup.value
      };
      this.isCompleted = true;
      this.goToNextStep();
    }
  }

  getSelectedSeatPrice(): number {
    return this.selectedSeatType?.price || 0;
  }

  getTotal(): number {
    return this.getSelectedSeatPrice() * (this.quantity || 1);
  }

  resetForm(): void {
    this.stepper.reset();
    this.selectedEvent = null;
    this.selectedSeatType = null;
    this.quantity = 1;
    this.personalInfo = { name: '', email: '', phone: '' };
    this.firstFormGroup.reset();
    this.secondFormGroup.reset({ quantity: 1 });
    this.thirdFormGroup.reset();
    this.isCompleted = false;
  }
}