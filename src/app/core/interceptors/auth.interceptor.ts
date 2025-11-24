import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

/**
 * Interceptor de autenticación que:
 * 1. Añade el header Authorization con el token JWT a todas las peticiones
 * 2. Maneja errores 401 globalmente redirigiendo a login y limpiando el token
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    // Obtener token del localStorage
    const token = localStorage.getItem('token');

    // Clonar la petición para añadir el header Authorization si existe token
    const authReq = token
        ? req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        })
        : req;

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // Manejo global de errores 401 Unauthorized
            if (error.status === 401) {
                // Limpiar token inválido
                localStorage.removeItem('token');

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
