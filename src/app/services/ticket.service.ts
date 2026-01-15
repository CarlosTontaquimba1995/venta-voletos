import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface TicketRequest {
    nombre_cliente: string;
    email_cliente: string;
    nombre_evento: string;
    monto_total: number;
    detalles: Array<{
        type: string;
        quantity: number;
        price: number;
        total: number;
    }>;
}

export interface TicketResponse {
    ticket: {
        id: string;
        token: string;
        nombre_cliente: string;
        email_cliente: string;
        estado: string;
        fecha_compra: string;
    };
    qrCodeUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class TicketService {
    private readonly apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    generateTicket(ticketData: TicketRequest): Observable<TicketResponse> {
        return this.http.post<TicketResponse>(
            `${this.apiUrl}/api/tickets/generar`,
            ticketData
        );
    }

    // Add other ticket-related methods here as needed
}
