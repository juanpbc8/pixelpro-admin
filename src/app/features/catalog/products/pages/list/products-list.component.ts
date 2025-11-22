import { Component, ChangeDetectionStrategy, signal, computed, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Product, Page, ProductQueryParams } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Category } from '../../../categories/models/category.model';
import { CategoryService } from '../../../categories/services/category.service';

@Component({
  selector: 'app-products-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onWindowResize()'
  }
})
export class ProductsListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchSubject = new Subject<string>();
  private readonly debounceTimeMs = 500;

  // State
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly totalElements = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(this.calculatePageSize()); // Dinámico basado en altura de pantalla
  readonly isLoading = signal<boolean>(false);

  // Filters
  readonly filters = signal<{
    search: string;
    status: string;
    categoryId: number | null;
  }>({
    search: '',
    status: '',
    categoryId: null
  });

  // Computed
  readonly isFirstPage = computed(() => this.currentPage() === 0);
  readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);
  readonly hasFilters = computed(() => {
    const f = this.filters();
    return !!(f.search || f.status || f.categoryId);
  });

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();

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
      this.loadProducts();
    });
  }

  /**
   * Calcula el tamaño de página óptimo basado en la altura de la ventana.
   */
  private calculatePageSize(): number {
    const height = window.innerHeight;

    if (height < 750) {
      return 6;
    } else if (height < 950) {
      return 8;
    } else {
      return 12;
    }
  }

  /**
   * Maneja cambios en el tamaño de la ventana.
   * Recalcula el pageSize y recarga si hay cambio significativo.
   */
  onWindowResize(): void {
    const newSize = this.calculatePageSize();
    const currentSize = this.pageSize();

    // Solo recalcular si el tamaño cambió
    if (newSize !== currentSize) {
      this.pageSize.set(newSize);
      this.currentPage.set(0); // Reset a primera página
      this.loadProducts();
    }
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading categories:', err);
      }
    });
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const f = this.filters();
    const params: ProductQueryParams = {
      page: this.currentPage(),
      size: this.pageSize(),
      ...(f.search && { search: f.search }),
      ...(f.status && { status: f.status }),
      ...(f.categoryId && { categoryId: f.categoryId })
    };

    this.productService.getProducts(params).subscribe({
      next: (page) => {
        this.products.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading products:', err);
        this.isLoading.set(false);
      }
    });
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const categoryId = select.value ? Number(select.value) : null;
    this.filters.update(f => ({ ...f, categoryId }));
    this.currentPage.set(0);
    this.loadProducts();
  }

  onStatusChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filters.update(f => ({ ...f, status: select.value }));
    this.currentPage.set(0);
    this.loadProducts();
  }

  onRefresh(): void {
    this.loadProducts();
  }

  onResetFilters(): void {
    this.filters.set({
      search: '',
      status: '',
      categoryId: null
    });
    // Limpiar el input de búsqueda
    const searchInput = document.getElementById('filterSearch') as HTMLInputElement;
    if (searchInput) searchInput.value = '';
    this.currentPage.set(0);
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
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

  navigateToCreate(): void {
    this.router.navigate(['/products/new']);
  }

  navigateToDetails(id: number): void {
    this.router.navigate(['/products', id]);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/products', id, 'edit']);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(price);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  }

  getCategoryName(product: Product): string {
    return product.category?.name || 'Sin categoría';
  }

  getStatusLabel(status: string): string {
    return status === 'ACTIVO' ? 'Activo' : 'Inactivo';
  }
}
