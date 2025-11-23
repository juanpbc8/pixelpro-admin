import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-roles-list',
    templateUrl: './roles-list.component.html',
    styleUrl: './roles-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule]
})
export class RolesListComponent implements OnInit {
    private userService = inject(UserService);
    private router = inject(Router);

    readonly roles = signal<string[]>([]);
    readonly isLoading = signal<boolean>(true);

    ngOnInit(): void {
        this.loadRoles();
    }

    loadRoles(): void {
        this.isLoading.set(true);
        this.userService.getRoles().subscribe({
            next: (roles) => {
                this.roles.set(roles);
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading roles:', err);
                this.isLoading.set(false);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }
}
