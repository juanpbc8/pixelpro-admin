import { Component, ChangeDetectionStrategy, signal, computed, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CustomerService } from '../../services/customer.service';
import { Customer, DocumentType, CustomerType, CustomerQueryParams } from '../../models/customer.model';

@Component({
  selector: 'app-customers-list',
  templateUrl: './customers-list.component.html',
  styleUrl: './customers-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, FormsModule],
  host: {
    '(window:resize)': 'onWindowResize()'
  }
})
export class CustomersListComponent implements OnInit {
  private readonly customerService = inject(CustomerService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();

  // State
  readonly customers = signal<Customer[]>([]);
  readonly totalElements = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(this.calculatePageSize());
  readonly isLoading = signal<boolean>(false);

  // Filters
  readonly filters = signal<{
    search: string;
    documentType: string;
    customerType: string;
  }>({
    search: '',
    documentType: '',
    customerType: ''
  });

  // Enums para el template
  readonly documentTypes = Object.values(DocumentType);
  readonly customerTypes = Object.values(CustomerType);

  // Computed
  readonly isFirstPage = computed(() => this.currentPage() === 0);
  readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);
  readonly hasFilters = computed(() => {
    const f = this.filters();
    return !!(f.search || f.documentType || f.customerType);
  });

  ngOnInit(): void {
    this.loadCustomers();

    // Configurar búsqueda instantánea con debounce
    this.searchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((searchTerm) => {
      this.filters.update(current => ({ ...current, search: searchTerm }));
      this.currentPage.set(0);
      this.loadCustomers();
    });
  }

  private calculatePageSize(): number {
    const height = window.innerHeight;
    if (height < 750) return 6;
    if (height < 950) return 8;
    return 10;
  }

  onWindowResize(): void {
    const newSize = this.calculatePageSize();
    if (newSize !== this.pageSize()) {
      this.pageSize.set(newSize);
      this.currentPage.set(0);
      this.loadCustomers();
    }
  }

  loadCustomers(): void {
    this.isLoading.set(true);
    const f = this.filters();
    const params: CustomerQueryParams = {
      page: this.currentPage(),
      size: this.pageSize(),
      ...(f.search && { search: f.search }),
      ...(f.documentType && { documentType: f.documentType }),
      ...(f.customerType && { customerType: f.customerType })
    };

    this.customerService.getCustomers(params).subscribe({
      next: (page) => {
        this.customers.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading customers:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onDocumentTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.update(f => ({ ...f, documentType: select.value }));
    this.currentPage.set(0);
    this.loadCustomers();
  }

  onCustomerTypeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.update(f => ({ ...f, customerType: select.value }));
    this.currentPage.set(0);
    this.loadCustomers();
  }

  onRefresh(): void {
    this.loadCustomers();
  }

  onResetFilters(): void {
    this.filters.set({
      search: '',
      documentType: '',
      customerType: ''
    });
    const searchInput = document.getElementById('filterSearch') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
    this.currentPage.set(0);
    this.loadCustomers();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadCustomers();
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

  getFullName(customer: Customer): string {
    return `${customer.firstName} ${customer.lastName}`;
  }

  getCustomerTypeLabel(type: string): string {
    return type === 'NATURAL' ? 'Natural' : 'Jurídica';
  }

  getCustomerTypeBadgeClass(type: string): string {
    return type === 'NATURAL' ? 'bg-success' : 'bg-primary';
  }
}
