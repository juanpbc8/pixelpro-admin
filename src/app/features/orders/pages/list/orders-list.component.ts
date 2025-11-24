import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OrderService } from '../../services/order.service';
import { Order, OrderStatus, DeliveryType, OrderQueryParams } from '../../models/order.model';

@Component({
  selector: 'app-orders-list',
  templateUrl: './orders-list.component.html',
  styleUrl: './orders-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule],
  host: {
    '(window:resize)': 'onWindowResize()'
  }
})
export class OrdersListComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500;

  // State
  readonly orders = signal<Order[]>([]);
  readonly totalElements = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(this.calculatePageSize());
  readonly isLoading = signal<boolean>(false);

  // Filters
  readonly filters = signal<{
    search: string;
    status: string;
    deliveryType: string;
  }>({
    search: '',
    status: '',
    deliveryType: ''
  });

  // Enums para el template
  readonly orderStatuses = Object.values(OrderStatus);
  readonly deliveryTypes = Object.values(DeliveryType);

  // Computed
  readonly isFirstPage = computed(() => this.currentPage() === 0);
  readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);
  readonly hasFilters = computed(() => {
    const f = this.filters();
    return !!(f.search || f.status || f.deliveryType);
  });

  ngOnInit(): void {
    this.loadOrders();

    // Configurar búsqueda instantánea con debounce
    this.searchSubject.pipe(
      debounceTime(this.debounceTimeMs),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((searchTerm) => {
      // 1. Update the signal/filter state
      this.filters.update(current => ({ ...current, search: searchTerm }));

      // 2. Reset page to 0
      this.currentPage.set(0);

      // 3. CRITICAL: Trigger the API call
      this.loadOrders();
    });
  }

  private calculatePageSize(): number {
    const height = window.innerHeight;
    if (height < 750) return 5;
    if (height < 950) return 7;
    return 9;
  }

  onWindowResize(): void {
    const newSize = this.calculatePageSize();
    if (newSize !== this.pageSize()) {
      this.pageSize.set(newSize);
      this.currentPage.set(0);
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.isLoading.set(true);
    const f = this.filters();
    const params: OrderQueryParams = {
      page: this.currentPage(),
      size: this.pageSize(),
      ...(f.search && { search: f.search }),
      ...(f.status && { status: f.status }),
      ...(f.deliveryType && { deliveryType: f.deliveryType })
    };

    this.orderService.getAllOrders(params).subscribe({
      next: (page) => {
        this.orders.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading orders:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.update(f => ({ ...f, status: select.value }));
    this.currentPage.set(0);
    this.loadOrders();
  }

  onDeliveryTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.update(f => ({ ...f, deliveryType: select.value }));
    this.currentPage.set(0);
    this.loadOrders();
  }

  onRefresh(): void {
    this.loadOrders();
  }

  onResetFilters(): void {
    this.filters.set({
      search: '',
      status: '',
      deliveryType: ''
    });
    // Limpiar el input de búsqueda
    const searchInput = document.getElementById('filterSearch') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
    this.currentPage.set(0);
    this.loadOrders();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadOrders();
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

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case OrderStatus.ENTREGADO:
        return 'badge bg-success';
      case OrderStatus.PENDIENTE:
        return 'badge bg-warning text-dark';
      case OrderStatus.CANCELADO:
        return 'badge bg-danger';
      case OrderStatus.CONFIRMADO:
        return 'badge bg-info text-dark';
      case OrderStatus.PREPARANDO:
        return 'badge bg-primary';
      case OrderStatus.ENVIADO:
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
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
