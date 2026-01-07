import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    id: string;
    email: string;
    role: string;
    token?: string;
    // Add any other user properties you expect from the API
    firstName?: string;
    lastName?: string;
    cedula?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = environment.apiUrl;
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser$: Observable<User | null>;

    constructor(private http: HttpClient) {
        const storedUser = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<User | null>(
            storedUser ? JSON.parse(storedUser) : null
        );
        this.currentUser$ = this.currentUserSubject.asObservable();
    }

    get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<{ access_token: string; user: User }>(`${this.apiUrl}/api/auth/login`, { email, password })
            .pipe(
                tap(response => {
                    if (response && response.access_token) {
                        // Combine the user data with the token
                        const userWithToken = {
                            ...response.user,
                            token: response.access_token
                        };
                        localStorage.setItem('currentUser', JSON.stringify(userWithToken));
                        this.currentUserSubject.next(userWithToken);
                    }
                    return response;
                })
            );
    }

    register(userData: {
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        cedula: string;
    }) {
        return this.http.post<User>(`${this.apiUrl}/api/auth/register`, userData);
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
    }

    isAuthenticated(): boolean {
        return !!this.currentUserValue?.token;
    }
}
