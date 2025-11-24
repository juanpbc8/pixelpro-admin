import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'header'
    }
})
export class HeaderComponent {
    private readonly authService = inject(AuthService);
    private readonly alertService = inject(AlertService);

    readonly currentUser = this.authService.currentUser;

    async onLogout(): Promise<void> {
        const confirmed = await this.alertService.confirm(
            '¿Cerrar sesión?',
            '¿Estás seguro de que deseas cerrar sesión?',
            'Sí, cerrar sesión'
        );

        if (confirmed) {
            this.authService.logout().subscribe();
        }
    }
}
