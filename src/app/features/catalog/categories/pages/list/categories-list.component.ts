import { Component, ChangeDetectionStrategy, signal, computed, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

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

  onDelete(category: Category): void {
    const confirmed = confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`);
    if (!confirmed) return;

    this.categoryService.deleteCategory(category.id!).subscribe({
      next: () => {
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        alert('Error al eliminar la categoría');
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
