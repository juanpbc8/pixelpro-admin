import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor de autenticación que:
 * 1. Asegura que todas las peticiones incluyan withCredentials: true (cookies)
 * 2. Maneja errores 401 globalmente redirigiendo a login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    // Clonar la petición para añadir withCredentials
    const authReq = req.clone({
        withCredentials: true
    });

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Manejo global de errores 401 Unauthorized
            if (error.status === 401) {
                // Solo redirigir si no estamos ya en login
                if (!router.url.includes('/auth/login')) {
                    router.navigate(['/auth/login'], {
                        queryParams: { returnUrl: router.url }
                    });
                }
            }

            return throwError(() => error);
        })
    );
};
