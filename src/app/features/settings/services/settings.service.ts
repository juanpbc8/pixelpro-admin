import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, tap } from 'rxjs';
import { Settings } from '../models/settings.model';

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    readonly settings = signal<Settings>(this.getDefaultSettings());
    readonly loading = signal<boolean>(false);

    private getDefaultSettings(): Settings {
        return {
            systemName: 'PixelPro Admin',
            country: 'Perú',
            currency: 'PEN (S/.)',
            timezone: 'America/Lima',
            dateFormat: 'dd/MM/yyyy',
            timeFormat: 'HH:mm',
            version: '1.0.0',

            taxIgv: 18,
            defaultShippingCost: 12.50,
            defaultDeliveryType: 'Envío estándar',

            passwordMinLength: 8,
            passwordResetEnabled: true,
            loginMaxAttempts: 5
        };
    }

    getSettings(): Observable<Settings> {
        this.loading.set(true);
        return of(this.settings()).pipe(
            delay(300),
            tap(() => this.loading.set(false))
        );
    }

    updateSettings(data: Partial<Settings>): Observable<Settings> {
        this.loading.set(true);

        const updatedSettings: Settings = {
            ...this.settings(),
            ...data
        };

        return of(updatedSettings).pipe(
            delay(300),
            tap((settings: Settings) => {
                this.settings.set(settings);
                this.loading.set(false);
            })
        );
    }

    resetToDefaults(): Observable<Settings> {
        this.loading.set(true);
        const defaults = this.getDefaultSettings();

        return of(defaults).pipe(
            delay(300),
            tap((settings: Settings) => {
                this.settings.set(settings);
                this.loading.set(false);
            })
        );
    }
}
