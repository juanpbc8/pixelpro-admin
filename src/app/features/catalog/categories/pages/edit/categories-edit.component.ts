import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Category } from '../../models/category.model';
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
                if (category) {
                    this.category.set(category);
                    this.patchForm(category);
                    this.notFound.set(false);
                } else {
                    this.notFound.set(true);
                }
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading category:', error);
                this.notFound.set(true);
                this.isLoading.set(false);
            }
        });
    }

    loadParentCategories(): void {
        this.categoryService.getParentCategories().subscribe({
            next: (categories) => {
                const filtered = categories.filter(c => c.id !== this.categoryId);
                this.parentCategories.set(filtered);
            },
            error: (error) => {
                console.error('Error loading parent categories:', error);
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

        const formValue = this.categoryForm.value;
        const changes: Partial<Category> = {
            name: formValue.name,
            parentCategoryId: formValue.parentCategoryId || null
        };

        this.categoryService.updateCategory(this.categoryId, changes).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.router.navigate(['/categories']);
            },
            error: (error) => {
                console.error('Error updating category:', error);
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
