import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Category, UpdateCategoryDto } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-categories-edit',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './categories-edit.component.html',
    styleUrl: './categories-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesEditComponent implements OnInit {
    private readonly categoryService = inject(CategoryService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);

    readonly category = signal<Category | null>(null);
    readonly parentCategories = signal<Category[]>([]);
    readonly isLoading = signal<boolean>(true);
    readonly isSubmitting = signal<boolean>(false);
    readonly notFound = signal<boolean>(false);
    readonly errorMessage = signal<string>('');
    readonly categoryForm: FormGroup;

    private categoryId: number = 0;

    constructor() {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            parentCategoryId: [null]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.categoryId = +params['id'];
            if (this.categoryId) {
                this.loadCategory();
                this.loadParentCategories();
            }
        });
    }

    loadCategory(): void {
        this.isLoading.set(true);
        this.categoryService.getCategoryById(this.categoryId).subscribe({
            next: (category) => {
                this.category.set(category);
                this.patchForm(category);
                this.notFound.set(false);
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading category:', err);
                this.errorMessage.set(err.error?.message || 'Error al cargar la categoría');
                this.notFound.set(true);
                this.isLoading.set(false);
            }
        });
    }

    loadParentCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                const filtered = categories.filter(c => c.id !== this.categoryId);
                this.parentCategories.set(filtered);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading categories:', err);
                this.errorMessage.set(err.error?.message || 'Error al cargar categorías');
            }
        });
    }

    patchForm(category: Category): void {
        this.categoryForm.patchValue({
            name: category.name,
            parentCategoryId: category.parentCategoryId || null
        });
    }

    onSubmit(): void {
        if (this.categoryForm.invalid) {
            this.categoryForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        const formValue = this.categoryForm.value;
        const dto: UpdateCategoryDto = {
            name: formValue.name,
            parentCategoryId: formValue.parentCategoryId || null
        };

        this.categoryService.updateCategory(this.categoryId, dto).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.router.navigate(['/categories']);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error updating category:', err);
                this.errorMessage.set(err.error?.message || 'Error al actualizar la categoría');
                this.isSubmitting.set(false);
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/categories']);
    }

    navigateToList(): void {
        this.router.navigate(['/categories']);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.categoryForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.categoryForm.get(fieldName);
        if (!field || !field.errors) return '';

        if (field.errors['required']) return 'Este campo es requerido';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;

        return 'Campo inválido';
    }
}
