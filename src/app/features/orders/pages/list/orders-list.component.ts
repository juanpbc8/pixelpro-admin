import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class OrdersListComponent {
  private orderService = inject(OrderService);

  readonly searchText = signal<string>('');
  readonly orders = computed(() => {
    const search = this.searchText().toLowerCase();
    const allOrders = this.orderService.orders();

    if (!search) {
      return allOrders;
    }

    return allOrders.filter((order: Order) =>
      order.code.toLowerCase().includes(search) ||
      `${order.customer.firstName} ${order.customer.lastName}`.toLowerCase().includes(search)
    );
  });

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  deleteOrder(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      this.orderService.deleteOrder(id).subscribe({
        next: () => {
          console.log('Orden eliminada exitosamente');
        },
        error: (error: Error) => {
          console.error('Error al eliminar la orden:', error);
        }
      });
    }
  }

  getStatusBadgeClass(status: string): string {
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }
}
