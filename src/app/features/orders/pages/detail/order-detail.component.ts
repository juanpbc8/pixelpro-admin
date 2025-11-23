import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, DeliveryType } from '../../models/order.model';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule]
})
export class OrderDetailComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  readonly order = signal<Order | null>(null);
  readonly loading = signal<boolean>(false);
  readonly notFound = signal<boolean>(false);
  readonly isUpdatingStatus = signal<boolean>(false);
  readonly showStatusDropdown = signal<boolean>(false);
  readonly selectedStatus = signal<string>('');

  readonly orderStatuses = Object.values(OrderStatus);

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

    this.loadOrder(id);
  }

  loadOrder(id: number): void {
    this.loading.set(true);
    this.orderService.getOrderById(id).subscribe({
      next: (order) => {
        this.order.set(order);
        this.selectedStatus.set(order.status);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading order:', err);
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }

  toggleStatusDropdown(): void {
    this.showStatusDropdown.update(val => !val);
  }

  async changeStatus(): Promise<void> {
    const currentOrder = this.order();
    if (!currentOrder || this.selectedStatus() === currentOrder.status) {
      this.showStatusDropdown.set(false);
      return;
    }

    const confirmed = await this.alertService.confirm(
      'Cambiar estado de orden',
      `¿Está seguro de cambiar el estado a "${this.getStatusLabel(this.selectedStatus())}"?`,
      'Sí, cambiar'
    );

    if (!confirmed) {
      this.selectedStatus.set(currentOrder.status);
      this.showStatusDropdown.set(false);
      return;
    }

    this.isUpdatingStatus.set(true);
    this.orderService.updateOrderStatus(currentOrder.id, this.selectedStatus()).subscribe({
      next: (updatedOrder) => {
        this.order.set(updatedOrder);
        this.isUpdatingStatus.set(false);
        this.showStatusDropdown.set(false);
        this.alertService.success(
          'Estado actualizado',
          'El estado de la orden ha sido actualizado exitosamente.'
        );
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error updating status:', err);
        this.selectedStatus.set(currentOrder.status);
        this.isUpdatingStatus.set(false);
        this.alertService.error(
          'Error al actualizar estado',
          err.error?.message || 'Error desconocido'
        );
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/orders']);
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      [OrderStatus.PENDIENTE]: 'Pendiente',
      [OrderStatus.CONFIRMADO]: 'Confirmado',
      [OrderStatus.PREPARANDO]: 'Preparando',
      [OrderStatus.ENVIADO]: 'Enviado',
      [OrderStatus.ENTREGADO]: 'Entregado',
      [OrderStatus.CANCELADO]: 'Cancelado'
    };
    return labels[status] || status;
  }

  getDeliveryTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      [DeliveryType.A_DOMICILIO]: 'Envío a domicilio',
      [DeliveryType.RECOJO_EN_TIENDA]: 'Recojo en tienda'
    };
    return labels[type] || type;
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
