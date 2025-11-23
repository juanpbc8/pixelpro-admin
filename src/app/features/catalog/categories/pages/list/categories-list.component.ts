import { Component, ChangeDetectionStrategy, signal, computed, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { AlertService } from '../../../../../shared/services/alert.service';

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

  readonly categories = signal<Category[]>([]);
  readonly searchTerm = signal<string>('');
  readonly isLoading = signal<boolean>(false);

  readonly filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.categories();
    }
    return this.categories().filter(category =>
      category.name.toLowerCase().includes(term)
    );
  });

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.isLoading.set(false);
      }
    });
  }

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
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
        this.loadCategories();
      },
      error: (error) => {
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
    const parent = this.categories().find(c => c.id === parentId);
    return parent?.name || 'Desconocida';
  }

  formatDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }
}
