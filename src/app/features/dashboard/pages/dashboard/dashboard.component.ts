import { Component, ChangeDetectionStrategy, inject, computed, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStats } from '../../models/dashboard.model';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
    private readonly dashboardService = inject(DashboardService);

    // State
    readonly stats = signal<DashboardStats | null>(null);
    readonly isLoading = signal<boolean>(false);
    readonly errorMessage = signal<string | null>(null);

    // Computed values from stats
    readonly totalOrders = computed(() => this.stats()?.totalOrders ?? 0);
    readonly completedOrders = computed(() => this.stats()?.completedOrders ?? 0);
    readonly pendingOrders = computed(() => this.stats()?.pendingOrders ?? 0);
    readonly totalRevenue = computed(() => this.stats()?.totalRevenue ?? 0);
    readonly totalCustomers = computed(() => this.stats()?.totalCustomers ?? 0);
    readonly totalProducts = computed(() => this.stats()?.totalProducts ?? 0);
    readonly chartData = computed(() => this.stats()?.salesChartData ?? []);
    readonly topProducts = computed(() => this.stats()?.topProducts ?? []);

    readonly maxChartValue = computed(() => {
        const values = this.chartData().map(d => d.value);
        const max = Math.max(...values, 1);
        return Math.ceil(max / 100) * 100; // Round up to nearest 100
    });
    readonly latestOrders = computed(() => this.stats()?.latestOrders ?? []);

    ngOnInit(): void {
        this.loadDashboardStats();
    }

    loadDashboardStats(): void {
        this.isLoading.set(true);
        this.errorMessage.set(null);

        this.dashboardService.getDashboardStats().subscribe({
            next: (stats) => {
                this.stats.set(stats);
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading dashboard stats:', err);
                this.errorMessage.set('Error al cargar las estadísticas del dashboard');
                this.isLoading.set(false);
            }
        });
    }

    reloadStats(): void {
        this.loadDashboardStats();
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN'
        }).format(value);
    }

    getStatusClass(status: string): string {
        const statusClasses: { [key: string]: string } = {
            'PENDIENTE': 'bg-warning',
            'CONFIRMADO': 'bg-info',
            'PREPARANDO': 'bg-primary',
            'ENVIADO': 'bg-secondary',
            'ENTREGADO': 'bg-success',
            'CANCELADO': 'bg-danger'
        };
        return statusClasses[status] || 'bg-secondary';
    }

    getStatusLabel(status: string): string {
        const statusLabels: { [key: string]: string } = {
            'PENDIENTE': 'Pendiente',
            'CONFIRMADO': 'Confirmado',
            'PREPARANDO': 'Preparando',
            'ENVIADO': 'Enviado',
            'ENTREGADO': 'Entregado',
            'CANCELADO': 'Cancelado'
        };
        return statusLabels[status] || status;
    }
}
