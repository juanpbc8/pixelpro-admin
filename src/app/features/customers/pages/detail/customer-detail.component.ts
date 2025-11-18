import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrl: './customer-detail.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class CustomerDetailComponent implements OnInit {
  private customerService = inject(CustomerService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  readonly customer = this.customerService.selectedCustomer;
  readonly loading = this.customerService.loading;
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

    this.customerService.loadCustomer(id);

    setTimeout(() => {
      if (!this.customer() && !this.loading()) {
        this.notFound.set(true);
      }
    }, 500);
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
    return type === 'natural' ? 'Natural' : 'Jurídica';
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
