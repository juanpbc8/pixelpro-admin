import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [RouterLink, RouterLinkActive],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'sidebar'
    }
})
export class SidebarComponent {
    readonly navigationItems = [
        { path: '/dashboard', label: 'Panel', icon: 'bi-speedometer2' },
        { path: '/products', label: 'Productos', icon: 'bi-box-seam' },
        { path: '/categories', label: 'Categorías', icon: 'bi-tags' },
        { path: '/orders', label: 'Órdenes', icon: 'bi-cart-check' },
        { path: '/customers', label: 'Clientes', icon: 'bi-people' },
        { path: '/users', label: 'Usuarios y Roles', icon: 'bi-person-badge' }
    ];
}
