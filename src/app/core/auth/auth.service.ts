import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, AuthResponse } from './auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly TOKEN_KEY = 'token';

    /**
     * Usuario autenticado actual.
     * Null indica que no hay usuario autenticado.
     */
    readonly currentUser = signal<User | null>(null);

    /**
     * Computed para verificar si el usuario está autenticado
     */
    readonly isAuthenticated = () => this.currentUser() !== null;

    /**
     * Inicia sesión con las credenciales proporcionadas
     * @throws Error si el usuario tiene rol CLIENTE (no permitido en admin panel)
     */
    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(
            `${environment.apiUrl}/api/auth/login`,
            credentials
        ).pipe(
            tap(response => {
                // REGLA DE NEGOCIO CRÍTICA: Solo usuarios con roles administrativos
                if (response.rol === 'CLIENTE') {
                    // No guardar token ni usuario
                    this.currentUser.set(null);
                    throw new Error('No tienes permisos de acceso al panel administrativo');
                }

                // Usuario válido, guardar token y actualizar estado
                localStorage.setItem(this.TOKEN_KEY, response.token);

                this.currentUser.set({
                    id: response.id,
                    email: response.email,
                    rol: response.rol,
                    authenticated: response.authenticated
                });
            }),
            catchError(error => {
                this.currentUser.set(null);
                localStorage.removeItem(this.TOKEN_KEY);
                return throwError(() => error);
            })
        );
    }

    /**
     * Verifica el estado de autenticación actual del usuario.
     * Usado en APP_INITIALIZER para mantener la sesión al recargar (F5).
     */
    checkAuthStatus(): Observable<AuthResponse | boolean> {
        // Primero verificar si existe token
        const token = localStorage.getItem(this.TOKEN_KEY);

        if (!token) {
            this.currentUser.set(null);
            return of(false);
        }

        // Si existe token, verificar con el backend
        return this.http.get<AuthResponse>(
            `${environment.apiUrl}/api/auth/me`
        ).pipe(
            tap(response => {
                // Solo establecer usuario si está autenticado y NO es CLIENTE
                if (response.authenticated && response.rol !== 'CLIENTE') {
                    this.currentUser.set({
                        id: response.id,
                        email: response.email,
                        rol: response.rol,
                        authenticated: response.authenticated
                    });
                } else {
                    this.currentUser.set(null);
                    localStorage.removeItem(this.TOKEN_KEY);
                }
            }),
            catchError(error => {
                // Si el endpoint falla (401, 403, etc), no hay sesión válida
                this.currentUser.set(null);
                localStorage.removeItem(this.TOKEN_KEY);
                return of(false);
            })
        );
    }

    /**
     * Cierra la sesión del usuario actual
     * En JWT stateless, solo limpiamos el estado local
     */
    logout(): void {
        // Limpiar token y usuario
        localStorage.removeItem(this.TOKEN_KEY);
        this.currentUser.set(null);

        // Redirigir a login
        this.router.navigate(['/auth/login']);
    }

    /**
     * Obtiene el token actual del localStorage
     */
    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
}
