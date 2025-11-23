import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

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

    readonly currentUser = this.authService.currentUser;

    onLogout(): void {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            this.authService.logout().subscribe();
        }
    }
}
