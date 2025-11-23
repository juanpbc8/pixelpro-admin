import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Category, CreateCategoryDto } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
    selector: 'app-categories-create',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './categories-create.component.html',
    styleUrl: './categories-create.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoriesCreateComponent implements OnInit {
    private readonly categoryService = inject(CategoryService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    readonly parentCategories = signal<Category[]>([]);
    readonly isSubmitting = signal<boolean>(false);
    readonly errorMessage = signal<string>('');
    readonly categoryForm: FormGroup;

    constructor() {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            parentCategoryId: [null]
        });
    }

    ngOnInit(): void {
        this.loadParentCategories();
    }

    loadParentCategories(): void {
        // Cargar un gran número de categorías para el dropdown
        this.categoryService.getCategories({ page: 0, size: 100 }).subscribe({
            next: (page) => {
                this.parentCategories.set(page.content); // Usar page.content, no page directamente
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading categories:', err);
                this.errorMessage.set(err.error?.message || 'Error al cargar categorías');
            }
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
        const dto: CreateCategoryDto = {
            name: formValue.name,
            parentCategoryId: formValue.parentCategoryId || null
        };

        this.categoryService.createCategory(dto).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.router.navigate(['/categories']);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error creating category:', err);
                this.errorMessage.set(err.error?.message || 'Error al crear la categoría');
                this.isSubmitting.set(false);
            }
        });
    }

    onCancel(): void {
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
