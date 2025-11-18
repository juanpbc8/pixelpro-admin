import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-roles-list',
    templateUrl: './roles-list.component.html',
    styleUrl: './roles-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class RolesListComponent {
    private userService = inject(UserService);
    private router = inject(Router);

    readonly roles = this.userService.roles;

    constructor() {
        this.loadRoles();
    }

    loadRoles(): void {
        this.userService.getRoles().subscribe();
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }
}
