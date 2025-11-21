import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

interface ApiError {
    timestamp: string;
    status: number;
    error: string;
    message: string;
    path: string;
    violations?: Array<{
        field: string;
        reason: string;
    }>;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Ha ocurrido un error inesperado';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Error del cliente: ${error.error.message}`;
            } else {
                // Server-side error
                const apiError = error.error as ApiError;

                if (apiError && apiError.message) {
                    errorMessage = apiError.message;

                    // Add validation errors if present
                    if (apiError.violations && apiError.violations.length > 0) {
                        const violations = apiError.violations
                            .map(v => `${v.field}: ${v.reason}`)
                            .join('; ');
                        errorMessage += ` (${violations})`;
                    }
                } else {
                    // Generic error based on status code
                    switch (error.status) {
                        case 400:
                            errorMessage = 'Solicitud incorrecta';
                            break;
                        case 401:
                            errorMessage = 'No autorizado. Por favor, inicia sesión';
                            break;
                        case 403:
                            errorMessage = 'No tienes permisos para realizar esta acción';
                            break;
                        case 404:
                            errorMessage = 'Recurso no encontrado';
                            break;
                        case 409:
                            errorMessage = 'Conflicto: el recurso ya existe o está en uso';
                            break;
                        case 500:
                            errorMessage = 'Error interno del servidor';
                            break;
                        default:
                            errorMessage = `Error del servidor (${error.status})`;
                    }
                }
            }

            console.error('HTTP Error:', {
                url: req.url,
                status: error.status,
                message: errorMessage,
                error: error.error
            });

            return throwError(() => new Error(errorMessage));
        })
    );
};
