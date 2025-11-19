import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../orders/services/order.service';
import { ProductService } from '../../../catalog/products/services/product.service';
import { CustomerService } from '../../../customers/services/customer.service';

interface ChartDataPoint {
    label: string;
    value: number;
}

interface TopProduct {
    id: number;
    name: string;
    quantitySold: number;
    totalRevenue: number;
}

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, RouterLink],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
    private orderService = inject(OrderService);
    private productService = inject(ProductService);
    private customerService = inject(CustomerService);

    private readonly orders = this.orderService.orders;
    private readonly products = this.productService.allProducts;
    private readonly customers = this.customerService.customers;

    // KPI calculations
    readonly totalOrders = computed(() => this.orders().length);

    readonly completedOrders = computed(() =>
        this.orders().filter(order => order.status === 'Completado').length
    );

    readonly pendingOrders = computed(() =>
        this.orders().filter(order => order.status === 'Pendiente').length
    );

    readonly totalRevenue = computed(() =>
        this.orders()
            .filter(order => order.status === 'Completado')
            .reduce((sum, order) => sum + order.total, 0)
    );

    readonly totalCustomers = computed(() => this.customers().length);

    readonly totalProducts = computed(() => this.products().length);

    // Latest orders (5 most recent)
    readonly latestOrders = computed(() => {
        const allOrders = [...this.orders()];
        return allOrders
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    });

    // Chart data for sales over last 14 days
    readonly chartData = computed(() => {
        const today = new Date();
        const days: ChartDataPoint[] = [];

        // Generate last 14 days
        for (let i = 13; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];

            // Calculate total sales for this day
            const dayTotal = this.orders()
                .filter(order => {
                    const orderDate = order.createdAt.split('T')[0];
                    return orderDate === dateStr && order.status === 'Completado';
                })
                .reduce((sum, order) => sum + order.total, 0);

            days.push({
                label: `${date.getDate()}/${date.getMonth() + 1}`,
                value: dayTotal
            });
        }

        return days;
    });

    readonly maxChartValue = computed(() => {
        const values = this.chartData().map(d => d.value);
        const max = Math.max(...values, 1);
        return Math.ceil(max / 100) * 100; // Round up to nearest 100
    });

    // Top selling products
    readonly topProducts = computed(() => {
        const productSales = new Map<number, { quantity: number; revenue: number }>();

        // Aggregate sales from all completed orders
        this.orders()
            .filter(order => order.status === 'Completado')
            .forEach(order => {
                order.items.forEach(item => {
                    const current = productSales.get(item.productId) || { quantity: 0, revenue: 0 };
                    productSales.set(item.productId, {
                        quantity: current.quantity + item.quantity,
                        revenue: current.revenue + (item.quantity * item.unitPrice)
                    });
                });
            });

        // Map to product details
        const topProducts: TopProduct[] = [];
        productSales.forEach((sales, productId) => {
            const product = this.products().find(p => p.id === productId);
            if (product && product.id !== undefined) {
                topProducts.push({
                    id: product.id,
                    name: product.name,
                    quantitySold: sales.quantity,
                    totalRevenue: sales.revenue
                });
            }
        });

        // Sort by quantity sold and take top 5
        return topProducts
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, 5);
    });

    getStatusClass(status: string): string {
        switch (status) {
            case 'Completado':
                return 'badge bg-success';
            case 'Pendiente':
                return 'badge bg-warning text-dark';
            case 'Cancelado':
                return 'badge bg-danger';
            default:
                return 'badge bg-secondary';
        }
    }

    formatCurrency(value: number): string {
        return `S/ ${value.toFixed(2)}`;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-PE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}
