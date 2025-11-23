import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { User, UserQueryParams } from '../../models/user.model';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrl: './users-list.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink, FormsModule],
    host: {
        '(window:resize)': 'onWindowResize()'
    }
})
export class UsersListComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly searchSubject = new Subject<string>();

    // State
    readonly users = signal<User[]>([]);
    readonly staffRoles = signal<string[]>([]);
    readonly totalElements = signal<number>(0);
    readonly totalPages = signal<number>(0);
    readonly currentPage = signal<number>(0);
    readonly pageSize = signal<number>(this.calculatePageSize());
    readonly isLoading = signal<boolean>(false);

    // Filters
    readonly filters = signal<{
        search: string;
        role: string;
    }>({
        search: '',
        role: '' // Vacío = "Todos los roles del Staff"
    });

    // Computed
    readonly isFirstPage = computed(() => this.currentPage() === 0);
    readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);
    readonly hasFilters = computed(() => {
        const f = this.filters();
        return f.search !== '' || f.role !== '';
    });

    ngOnInit(): void {
        // Cargar los roles de staff para el dropdown de filtros
        this.userService.getStaffRoles().subscribe({
            next: (roles) => {
                this.staffRoles.set(roles);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading staff roles:', err);
            }
        });

        // Cargar usuarios (solo staff)
        this.loadUsers();

        // Configurar búsqueda instantánea con debounce
        this.searchSubject.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((searchTerm) => {
            this.filters.update(current => ({ ...current, search: searchTerm }));
            this.currentPage.set(0);
            this.loadUsers();
        });
    }

    private calculatePageSize(): number {
        const height = window.innerHeight;
        if (height < 750) return 6;
        if (height < 950) return 8;
        return 10;
    }

    onWindowResize(): void {
        const newSize = this.calculatePageSize();
        if (newSize !== this.pageSize()) {
            this.pageSize.set(newSize);
            this.currentPage.set(0);
            this.loadUsers();
        }
    }

    loadUsers(): void {
        this.isLoading.set(true);
        const f = this.filters();
        const params: UserQueryParams = {
            staffOnly: true, // SIEMPRE excluir usuarios con rol CLIENTE
            page: this.currentPage(),
            size: this.pageSize(),
            ...(f.search && { search: f.search }),
            ...(f.role && { role: f.role })
        };

        this.userService.getUsers(params).subscribe({
            next: (page) => {
                this.users.set(page.content);
                this.totalElements.set(page.totalElements);
                this.totalPages.set(page.totalPages);
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading users:', err);
                this.isLoading.set(false);
            }
        });
    }

    onSearchInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.searchSubject.next(input.value);
    }

    onRoleChange(event: Event): void {
        const select = event.target as HTMLSelectElement;
        this.filters.update(f => ({ ...f, role: select.value }));
        this.currentPage.set(0);
        this.loadUsers();
    }

    onRefresh(): void {
        this.loadUsers();
    }

    onResetFilters(): void {
        this.filters.set({
            search: '',
            role: '' // Vacío = "Todos los roles del Staff"
        });
        const searchInput = document.getElementById('filterSearch') as HTMLInputElement;
        if (searchInput) searchInput.value = '';
        this.currentPage.set(0);
        this.loadUsers();
    }

    onPageChange(page: number): void {
        this.currentPage.set(page);
        this.loadUsers();
    }

    onPreviousPage(): void {
        if (!this.isFirstPage()) {
            this.onPageChange(this.currentPage() - 1);
        }
    }

    onNextPage(): void {
        if (!this.isLastPage()) {
            this.onPageChange(this.currentPage() + 1);
        }
    }

    getRoleBadgeClass(roleName: string): string {
        const badgeMap: { [key: string]: string } = {
            'ADMIN': 'bg-danger',
            'MANAGER': 'bg-primary',
            'OPERATOR': 'bg-info',
            'CLIENTE': 'bg-secondary' // Por si acaso aparece
        };
        return badgeMap[roleName] || 'bg-secondary';
    }

    formatDate(dateString?: string | null): string {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(date);
    }
}
