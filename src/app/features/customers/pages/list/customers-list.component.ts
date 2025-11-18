import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../models/customer.model';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink]
})
export class CustomersListComponent {
  private customerService = inject(CustomerService);

  readonly searchText = signal<string>('');
  readonly customers = computed(() => {
    const search = this.searchText().toLowerCase();
    const allCustomers = this.customerService.customers();

    if (!search) {
      return allCustomers;
    }

    return allCustomers.filter((customer: Customer) =>
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(search) ||
      customer.documentNumber.toLowerCase().includes(search) ||
      customer.email.toLowerCase().includes(search)
    );
  });

  constructor() {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  deleteCustomer(id: number, fullName: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al cliente ${fullName}?`)) {
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          console.log('Cliente eliminado exitosamente');
        },
        error: (error: Error) => {
          console.error('Error al eliminar el cliente:', error);
        }
      });
    }
  }

  getFullName(customer: Customer): string {
    return `${customer.firstName} ${customer.lastName}`;
  }

  getCustomerTypeLabel(type: string): string {
    return type === 'natural' ? 'Natural' : 'Jurídica';
  }
}
