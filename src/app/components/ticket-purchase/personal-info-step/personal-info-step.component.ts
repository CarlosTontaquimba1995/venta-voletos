import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-personal-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <form [formGroup]="formGroup" (ngSubmit)="onSubmit()">
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Nombre Completo</mat-label>
        <input matInput formControlName="name" required>
        <mat-error *ngIf="formGroup.get('name')?.hasError('required')">
          El nombre es requerido
        </mat-error>
        <mat-error *ngIf="formGroup.get('name')?.hasError('minlength')">
          El nombre debe tener al menos 3 caracteres
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Correo Electrónico</mat-label>
        <input matInput type="email" formControlName="email" required>
        <mat-error *ngIf="formGroup.get('email')?.hasError('required')">
          El correo es requerido
        </mat-error>
        <mat-error *ngIf="formGroup.get('email')?.hasError('email')">
          Ingresa un correo válido
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Teléfono</mat-label>
        <input matInput formControlName="phone" required>
        <mat-error *ngIf="formGroup.get('phone')?.hasError('required')">
          El teléfono es requerido
        </mat-error>
        <mat-error *ngIf="formGroup.get('phone')?.hasError('pattern')">
          Ingresa un número de teléfono válido (10 dígitos)
        </mat-error>
      </mat-form-field>

      <div class="button-container">
        <button mat-raised-button color="primary" type="submit" [disabled]="!formGroup.valid">
          Continuar
        </button>
      </div>
    </form>
  `,
  styles: [`
    :host {
      display: block;
      padding: 1rem;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }
    
    .button-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 1.5rem;
    }
    
    button {
      min-width: 120px;
    }
  `]
})
export class PersonalInfoStepComponent {
  @Input() formGroup!: FormGroup;
  @Output() formSubmitted = new EventEmitter<void>();

  onSubmit(): void {
    if (this.formGroup.valid) {
      this.formSubmitted.emit();
    }
  }
}
