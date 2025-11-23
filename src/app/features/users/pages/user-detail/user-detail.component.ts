import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-user-detail',
    templateUrl: './user-detail.component.html',
    styleUrl: './user-detail.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, RouterLink]
})
export class UserDetailComponent implements OnInit {
    private userService = inject(UserService);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    readonly user = signal<User | null>(null);
    readonly isLoading = signal<boolean>(true);
    readonly notFound = signal<boolean>(false);

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');

        if (!idParam) {
            this.notFound.set(true);
            this.isLoading.set(false);
            return;
        }

        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            this.notFound.set(true);
            this.isLoading.set(false);
            return;
        }

        this.loadUser(id);
    }

    private loadUser(id: number): void {
        this.isLoading.set(true);
        this.userService.getUserById(id).subscribe({
            next: (user) => {
                this.user.set(user);
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading user:', err);
                this.notFound.set(true);
                this.isLoading.set(false);
            }
        });
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }

    formatDate(dateString?: string | null): string {
        if (!dateString) return '-';

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';

        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
}
