import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Event } from '../ticket-purchase-stepper/ticket-purchase-stepper.component';

@Component({
  selector: 'app-event-selection-step',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './event-selection-step.component.html',
  styleUrls: ['./event-selection-step.component.scss']
})
export class EventSelectionStepComponent {
  @Input() events: Event[] = [
    { id: 1, name: 'Concierto de Rock', date: '2023-12-25', location: 'Estadio Olímpico' },
    { id: 2, name: 'Festival de Jazz', date: '2023-12-30', location: 'Teatro Nacional' },
    { id: 3, name: 'Partido de Fútbol', date: '2024-01-05', location: 'Estadio Monumental' }
  ];

  @Input() selectedEvent: Event | null = null;
  @Output() eventSelected = new EventEmitter<Event>();

  onEventSelected(event: Event): void {
    this.eventSelected.emit(event);
  }

  onSelectEvent(event: Event): void {
    this.eventSelected.emit(event);
  }
}
