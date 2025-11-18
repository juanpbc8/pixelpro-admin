import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

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

    readonly user = this.userService.selectedUser;
    readonly loading = this.userService.loading;
    readonly notFound = signal<boolean>(false);

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');

        if (!idParam) {
            this.notFound.set(true);
            return;
        }

        const id = parseInt(idParam, 10);

        if (isNaN(id)) {
            this.notFound.set(true);
            return;
        }

        this.userService.loadUser(id);

        setTimeout(() => {
            if (!this.user() && !this.loading()) {
                this.notFound.set(true);
            }
        }, 500);
    }

    goBack(): void {
        this.router.navigate(['/users']);
    }

    formatDate(date: string): string {
        return new Intl.DateTimeFormat('es-PE', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    }
}
