import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

/**
 * Guard para proteger rutas que requieren autenticación.
 * Redirige a /login si el usuario no está autenticado.
 */
export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (authService.isAuthenticated()) {
        return true;
    }

    // Usuario no autenticado, redirigir a login
    return router.createUrlTree(['/auth/login'], {
        queryParams: { returnUrl: state.url }
    });
};
