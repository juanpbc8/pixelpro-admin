import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/auth/auth.service';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';

/**
 * Inicializa el estado de autenticación antes de arrancar la aplicación.
 * Verifica si hay una sesión activa para mantener al usuario logueado al recargar (F5).
 */
export function initializeAuth(authService: AuthService) {
  return () => firstValueFrom(
    authService.checkAuthStatus().pipe(
      // Ignorar errores, simplemente no habrá usuario autenticado
      // Usando catchError interno del servicio
    )
  ).catch(() => {
    // Silenciar errores de inicialización
    // El usuario simplemente estará desautenticado
    return Promise.resolve();
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
