import { ChangeDetectorRef, Component, ViewChild, HostListener, ElementRef, AfterViewInit, Inject } from '@angular/core';
import { TicketService, TicketRequest, TicketResponse } from '../../../services/ticket.service';
import { CommonModule } from '@angular/common';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDividerModule } from "@angular/material/divider";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';

// Step Components
import { EventSelectionStepComponent } from '../event-selection-step/event-selection-step.component';
import { SeatSelectionStepComponent } from '../seat-selection-step/seat-selection-step.component';
import { PersonalInfoStepComponent } from '../personal-info-step/personal-info-step.component';
import { ConfirmationStepComponent } from '../confirmation-step/confirmation-step.component';
import { ConfirmTicketDialogComponent } from '../confirm-ticket-dialog/confirm-ticket-dialog.component';

// Services

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
    MatSnackBarModule,
    MatDialogModule,
    // Step Components
    EventSelectionStepComponent,
    SeatSelectionStepComponent,
    PersonalInfoStepComponent,
    ConfirmationStepComponent
  ],
  templateUrl: './ticket-purchase-stepper.component.html',
  styleUrls: ['./ticket-purchase-stepper.component.scss']
})
export class TicketPurchaseStepperComponent implements AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(ConfirmationStepComponent) confirmationStep!: ConfirmationStepComponent;

  // Prevent clicks on stepper headers
  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // Check if the click is on a stepper header
    const target = event.target as HTMLElement;
    if (target.closest('.mat-step-header')) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  ngAfterViewInit() {
    // Disable pointer events on stepper headers
    if (this.stepper && this.stepper._stepHeader) {
      const headers = document.querySelectorAll('.mat-step-header');
      headers.forEach(header => {
        (header as HTMLElement).style.pointerEvents = 'none';
      });
    }
  }

  isLinear = true;
  isCompleted = false;
  isGeneratingTicket = false;

  // Form groups for each step
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  // Data to pass between steps
  selectedEvent: Event | null = null;
  selectedSeatType: SeatType | null = null;
  selectedSeats: { seatType: SeatType, quantity: number }[] = [];
  quantity: number = 1;
  personalInfo: PersonalInfo = {
    name: '',
    email: '',
    phone: ''
  };

  constructor(
    private formBuilder: FormBuilder,
    private cdRef: ChangeDetectorRef,
    @Inject(TicketService) private ticketService: TicketService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.firstFormGroup = this.formBuilder.group({
      event: ['', Validators.required]
    });

    this.secondFormGroup = this.formBuilder.group({
      seatType: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });

    this.thirdFormGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
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

  onSeatSelectionsChange(selections: { seatType: SeatType, quantity: number }[]): void {
    this.selectedSeats = selections;
    this.cdRef.detectChanges();
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

  onConfirmPurchase(): void {
    if (this.isGeneratingTicket) return;

    if (!this.selectedEvent || this.selectedSeats.length === 0 || !this.personalInfo) {
      this.snackBar.open('Por favor complete todos los pasos del formulario', 'Cerrar', {
        duration: 5000,
        panelClass: ['error-snackbar']
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfirmTicketDialogComponent, {
      width: '500px',
      data: {
        event: this.selectedEvent,
        total: this.getTotal()
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.processPurchase();
      }
    });
  }

  private processPurchase(): void {
    this.isGeneratingTicket = true;

    // Prepare ticket data
    const ticketData: TicketRequest = {
      nombre_cliente: this.personalInfo.name,
      email_cliente: this.personalInfo.email,
      monto_total: this.getTotal(),
      detalles: this.selectedSeats.map(seat => ({
        type: seat.seatType.id,
        quantity: seat.quantity,
        price: seat.seatType.price,
        total: seat.seatType.price * seat.quantity
      }))
    };

    // Call the ticket service
    this.ticketService.generateTicket(ticketData).pipe(
      finalize(() => {
        this.isGeneratingTicket = false;
        this.cdRef.detectChanges();
      })
    ).subscribe({
      next: (response: TicketResponse) => {
        // Pass the ticket response to the confirmation component
        this.confirmationStep.ticketResponse = response;
        this.isCompleted = true;

        // Move to the next step
        if (this.stepper) {
          this.stepper.next();
        }
      },
      error: (error) => {
        console.error('Error generating ticket:', error);
        this.snackBar.open(
          'Error al procesar la compra. Por favor, intente nuevamente.',
          'Cerrar',
          {
            duration: 5000,
            panelClass: ['error-snackbar']
          }
        );
      }
    });
  }

  getSelectedSeatPrice(): number {
    return this.selectedSeatType?.price || 0;
  }

  getTotal(): number {
    return this.selectedSeats.reduce((total, seat) => {
      return total + (seat.seatType.price * seat.quantity);
    }, 0);
  }

  resetForm(): void {
    this.stepper.reset();
    this.selectedEvent = null;
    this.selectedSeatType = null;
    this.selectedSeats = [];
    this.quantity = 1;
    this.personalInfo = { name: '', email: '', phone: '' };
    this.firstFormGroup.reset();
    this.secondFormGroup.reset({ quantity: 1 });
    this.thirdFormGroup.reset();
    this.isCompleted = false;
  }
}