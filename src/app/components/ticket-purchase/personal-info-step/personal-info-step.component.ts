import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-personal-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  host: {
    class: 'personal-info-step'
  },
  templateUrl: './personal-info-step.component.html',
  styleUrls: ['./personal-info-step.component.scss']
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
