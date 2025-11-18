import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
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
        this.categoryService.getParentCategories().subscribe({
            next: (categories) => {
                this.parentCategories.set(categories);
            },
            error: (error) => {
                console.error('Error loading parent categories:', error);
            }
        });
    }

    onSubmit(): void {
        if (this.categoryForm.invalid) {
            this.categoryForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);

        const formValue = this.categoryForm.value;
        const category: Category = {
            name: formValue.name,
            parentCategoryId: formValue.parentCategoryId || null
        };

        this.categoryService.createCategory(category).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.router.navigate(['/categories']);
            },
            error: (error) => {
                console.error('Error creating category:', error);
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
