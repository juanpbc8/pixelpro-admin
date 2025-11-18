import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink]
})
export class UsersListComponent {
    private userService = inject(UserService);

    readonly searchText = signal<string>('');
    readonly users = computed(() => {
        const search = this.searchText().toLowerCase();
        const allUsers = this.userService.users();

        if (!search) {
            return allUsers;
        }

        return allUsers.filter((user: User) =>
            user.email.toLowerCase().includes(search) ||
            user.role.name.toLowerCase().includes(search)
        );
    });

    constructor() {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getUsers().subscribe();
    }

    onSearchChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchText.set(input.value);
    }

    formatDate(date: string): string {
        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(date));
    }
}
