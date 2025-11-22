import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class CustomerDetailComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly customer = signal<Customer | null>(null);
  readonly loading = signal<boolean>(false);
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

    this.loadCustomer(id);
  }

  loadCustomer(id: number): void {
    this.loading.set(true);
    this.customerService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer.set(customer);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading customer:', err);
        this.loading.set(false);
        if (err.status === 404) {
          this.notFound.set(true);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  getFullName(): string {
    const c = this.customer();
    if (!c) return '';
    return `${c.firstName} ${c.lastName}`;
  }

  getCustomerTypeLabel(type: string): string {
    return type === 'NATURAL' ? 'Natural' : 'Jurídica';
  }

  formatDate(dateString?: string | null): string {
    // Retornar '-' si el valor es null, undefined o cadena vacía
    if (!dateString) return '-';

    const date = new Date(dateString);

    // Verificar si la fecha es inválida
    if (isNaN(date.getTime())) {
      return '-';
    }

    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
