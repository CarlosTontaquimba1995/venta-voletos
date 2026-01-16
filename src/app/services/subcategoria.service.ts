import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    SubcategoriaResponse,
    SubcategoriaListResponse
} from '../models/subcategoria.types';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubcategoriaService {
    private apiUrl = `${environment.apiUrlPawkar}/api/subcategorias`;

    constructor(private http: HttpClient) { }

    /**
     * Obtiene todas las subcategorías disponibles
     */
    getSubcategorias(): Observable<SubcategoriaListResponse> {
        return this.http.get<SubcategoriaListResponse>(this.apiUrl);
    }

    /**
     * Obtiene una subcategoría por su ID
     * @param id ID de la subcategoría
     */
    getSubcategoriaById(id: number): Observable<SubcategoriaResponse> {
        return this.http.get<SubcategoriaResponse>(`${this.apiUrl}/${id}`);
    }

    /**
     * Obtiene todas las subcategorías de una categoría específica
     * @param categoriaId ID de la categoría
     */
    getSubcategoriasByCategoria(categoriaId: number): Observable<SubcategoriaListResponse> {
        return this.http.get<SubcategoriaListResponse>(`${this.apiUrl}/categoria/${categoriaId}`);
    }

    /**
     * Obtiene los próximos eventos (subcategorías con proximo = true) de la categoría de eventos
     * @returns Lista de próximos eventos
     */
    getProximosEventos(): Observable<SubcategoriaListResponse> {
        return this.http.get<SubcategoriaListResponse>(`${this.apiUrl}/eventos/proximos`);
    }

    /**
     * Obtiene los eventos pasados (subcategorías con proximo = false) de la categoría de eventos
     * @returns Lista de eventos pasados
     */
    getEventosPasados(): Observable<SubcategoriaListResponse> {
        return this.http.get<SubcategoriaListResponse>(`${this.apiUrl}/eventos/pasados`);
    }

    // Métodos legacy para mantener compatibilidad
    getCategories(): Observable<SubcategoriaListResponse> {
        return this.getSubcategorias();
    }
}
