import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class OrderDetailComponent implements OnInit {
  private orderService = inject(OrderService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly order = this.orderService.selectedOrder;
  readonly loading = this.orderService.loading;
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

    this.orderService.loadOrder(id);

    setTimeout(() => {
      if (!this.order() && !this.loading()) {
        this.notFound.set(true);
      }
    }, 500);
  }

  goBack(): void {
    this.router.navigate(['/orders']);
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

  getPaymentStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Pagado':
        return 'badge bg-success';
      case 'Pendiente':
        return 'badge bg-warning text-dark';
      case 'Cancelado':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }

  getInvoiceStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Emitida':
        return 'badge bg-success';
      case 'Pendiente':
        return 'badge bg-warning text-dark';
      case 'Anulada':
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

  formatDate(date: string | null | undefined): string {
    if (!date) return 'N/A';

    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  }

  calculateItemTotal(unitPrice: number, quantity: number): number {
    return unitPrice * quantity;
  }
}
