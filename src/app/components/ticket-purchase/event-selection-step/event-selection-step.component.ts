import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { SubcategoriaService } from '../../../services/subcategoria.service';
import { Event } from '../../../models/event.interface';

@Component({
  selector: 'app-event-selection-step',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './event-selection-step.component.html',
  styleUrls: ['./event-selection-step.component.scss']
})
export class EventSelectionStepComponent implements OnInit {
  events: Event[] = [];
  loading = true;
  error: string | null = null;

  @Input() selectedEvent: Event | null = null;
  @Output() eventSelected = new EventEmitter<Event>();

  constructor(private subcategoriaService: SubcategoriaService) { }

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    this.subcategoriaService.getProximosEventos().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          this.events = response.data.map((event: any) => ({
            id: event.id || 0,
            name: event.nombre || 'Evento sin nombre',
            date: event.fechaEvento || new Date().toISOString(),
            location: event.ubicacion || 'Ubicación no especificada',
            descripcion: event.descripcion
          }));
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar eventos:', err);
        this.error = 'No se pudieron cargar los eventos. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }

  onEventSelected(event: Event): void {
    this.eventSelected.emit(event);
  }

  onSelectEvent(event: Event): void {
    this.eventSelected.emit(event);
  }
}
