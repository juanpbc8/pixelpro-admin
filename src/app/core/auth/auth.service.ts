import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginRequest, AuthResponse } from './auth.model';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);

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
            credentials,
            { withCredentials: true }
        ).pipe(
            switchMap(response => {
                // REGLA DE NEGOCIO CRÍTICA: Solo usuarios con roles administrativos
                if (response.rol === 'CLIENTE') {
                    // Limpiar sesión inmediatamente en el backend
                    return this.http.post<void>(
                        `${environment.apiUrl}/api/auth/logout`,
                        {},
                        { withCredentials: true }
                    ).pipe(
                        switchMap(() => {
                            // Después de hacer logout, lanzar error
                            this.currentUser.set(null);
                            return throwError(() => new Error('No tienes permisos de acceso al panel administrativo'));
                        })
                    );
                }

                // Usuario válido, actualizar estado
                this.currentUser.set({
                    id: response.id,
                    email: response.email,
                    rol: response.rol,
                    authenticated: response.authenticated
                });

                return new Observable<AuthResponse>(observer => {
                    observer.next(response);
                    observer.complete();
                });
            }),
            catchError(error => {
                this.currentUser.set(null);
                return throwError(() => error);
            })
        );
    }

    /**
     * Verifica el estado de autenticación actual del usuario.
     * Usado en APP_INITIALIZER para mantener la sesión al recargar (F5).
     */
    checkAuthStatus(): Observable<AuthResponse> {
        return this.http.get<AuthResponse>(
            `${environment.apiUrl}/api/auth/me`,
            { withCredentials: true }
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
                }
            }),
            catchError(error => {
                // Si el endpoint falla (401, 403, etc), no hay sesión válida
                this.currentUser.set(null);
                return throwError(() => error);
            })
        );
    }

    /**
     * Cierra la sesión del usuario actual
     */
    logout(): Observable<void> {
        return this.http.post<void>(
            `${environment.apiUrl}/api/auth/logout`,
            {},
            { withCredentials: true }
        ).pipe(
            tap(() => {
                this.currentUser.set(null);
                this.router.navigate(['/auth/login']);
            }),
            catchError(error => {
                // Incluso si el logout falla, limpiar el estado local
                this.currentUser.set(null);
                this.router.navigate(['/auth/login']);
                return throwError(() => error);
            })
        );
    }
}
