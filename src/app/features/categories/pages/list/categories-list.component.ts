import { Component, ChangeDetectionStrategy, signal, computed, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { AlertService } from '../../../../shared/services/alert.service';

@Component({
  selector: 'app-categories-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesListComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);

  // State - Paginación
  readonly categories = signal<Category[]>([]);
  readonly allCategories = signal<Category[]>([]); // Para el dropdown de filtro
  readonly totalElements = signal<number>(0);
  readonly totalPages = signal<number>(0);
  readonly currentPage = signal<number>(0);
  readonly pageSize = signal<number>(10);
  readonly isLoading = signal<boolean>(false);

  // Filtros
  readonly selectedParentId = signal<number | null>(null);

  // Computed
  readonly isFirstPage = computed(() => this.currentPage() === 0);
  readonly isLastPage = computed(() => this.currentPage() >= this.totalPages() - 1);
  readonly hasFilters = computed(() => this.selectedParentId() !== null);

  ngOnInit(): void {
    this.loadAllCategoriesForFilter();
    this.loadCategories();
  }

  /**
   * Carga todas las categorías para el dropdown de filtro (sin paginación)
   * Usa una llamada con size muy grande para obtener todas
   */
  loadAllCategoriesForFilter(): void {
    this.categoryService.getCategories({ page: 0, size: 1000 }).subscribe({
      next: (page) => {
        this.allCategories.set(page.content);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading categories for filter:', error);
      }
    });
  }

  loadCategories(): void {
    this.isLoading.set(true);
    const params = {
      page: this.currentPage(),
      size: this.pageSize(),
      sort: 'updatedAt,desc',
      ...(this.selectedParentId() !== null && { parentId: this.selectedParentId()! })
    };

    this.categoryService.getCategories(params).subscribe({
      next: (page) => {
        this.categories.set(page.content);
        this.totalElements.set(page.totalElements);
        this.totalPages.set(page.totalPages);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading categories:', error);
        this.isLoading.set(false);
      }
    });
  }

  onParentCategoryChange(parentId: string): void {
    this.selectedParentId.set(parentId ? Number(parentId) : null);
    this.currentPage.set(0); // Reset a la primera página
    this.loadCategories();
  }

  onResetFilters(): void {
    this.selectedParentId.set(null);
    this.currentPage.set(0);
    this.loadCategories();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadCategories();
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
    this.router.navigate(['/categories/new']);
  }

  navigateToEdit(id: number): void {
    this.router.navigate(['/categories', id, 'edit']);
  }

  async onDelete(category: Category): Promise<void> {
    const confirmed = await this.alertService.confirmDelete(
      '¿Eliminar categoría?',
      `¿Estás seguro de eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
      'Sí, eliminar'
    );

    if (!confirmed) return;

    this.categoryService.deleteCategory(category.id!).subscribe({
      next: () => {
        this.alertService.success(
          'Categoría eliminada',
          'La categoría ha sido eliminada exitosamente.'
        );
        // Recargar categorías y el filtro
        this.loadAllCategoriesForFilter();
        this.loadCategories();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting category:', error);
        this.alertService.error(
          'Error al eliminar',
          error.error?.message || 'No se pudo eliminar la categoría.'
        );
      }
    });
  }

  getParentCategoryName(parentId: number | null | undefined): string {
    if (!parentId) return 'Ninguna';
    const parent = this.allCategories().find(c => c.id === parentId);
    return parent?.name || 'Desconocida';
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
}
