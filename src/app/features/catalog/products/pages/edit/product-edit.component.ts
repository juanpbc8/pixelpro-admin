import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-edit',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-edit.component.html',
    styleUrl: './product-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductEditComponent implements OnInit {
    private readonly productService = inject(ProductService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);

    readonly product = signal<Product | null>(null);
    readonly categories = signal<Category[]>([]);
    readonly isLoading = signal<boolean>(true);
    readonly isSubmitting = signal<boolean>(false);
    readonly notFound = signal<boolean>(false);
    readonly productForm: FormGroup;

    private productId: number = 0;

    constructor() {
        this.productForm = this.fb.group({
            sku: ['', [Validators.required, Validators.minLength(3)]],
            name: ['', [Validators.required, Validators.minLength(3)]],
            model: [''],
            description: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            qtyStock: [0, [Validators.required, Validators.min(0)]],
            imageUrl: [''],
            status: ['ACTIVE', Validators.required],
            categoryIds: [[]]
        });
    }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.productId = +params['id'];
            if (this.productId) {
                this.loadProduct();
                this.loadCategories();
            }
        });
    }

    loadProduct(): void {
        this.isLoading.set(true);
        this.productService.getProductById(this.productId).subscribe({
            next: (product) => {
                if (product) {
                    this.product.set(product);
                    this.patchForm(product);
                    this.notFound.set(false);
                } else {
                    this.notFound.set(true);
                }
                this.isLoading.set(false);
            },
            error: (error) => {
                console.error('Error loading product:', error);
                this.notFound.set(true);
                this.isLoading.set(false);
            }
        });
    }

    loadCategories(): void {
        this.productService.getCategories().subscribe({
            next: (categories) => {
                this.categories.set(categories);
            },
            error: (error) => {
                console.error('Error loading categories:', error);
            }
        });
    }

    patchForm(product: Product): void {
        this.productForm.patchValue({
            sku: product.sku,
            name: product.name,
            model: product.model || '',
            description: product.description || '',
            price: product.price,
            qtyStock: product.qtyStock,
            imageUrl: product.imageUrl || '',
            status: product.status,
            categoryIds: product.categories.map(c => c.id).filter(id => id !== undefined)
        });
    }

    onCategoryChange(event: Event, categoryId: number): void {
        const checkbox = event.target as HTMLInputElement;
        const currentIds = this.productForm.get('categoryIds')?.value || [];

        if (checkbox.checked) {
            this.productForm.patchValue({
                categoryIds: [...currentIds, categoryId]
            });
        } else {
            this.productForm.patchValue({
                categoryIds: currentIds.filter((id: number) => id !== categoryId)
            });
        }
    }

    isCategorySelected(categoryId: number): boolean {
        const currentIds = this.productForm.get('categoryIds')?.value || [];
        return currentIds.includes(categoryId);
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        this.isSubmitting.set(true);

        const formValue = this.productForm.value;
        const selectedCategoryIds: number[] = formValue.categoryIds || [];
        const selectedCategories = this.categories().filter(c =>
            c.id && selectedCategoryIds.includes(c.id)
        );

        const changes: Partial<Product> = {
            sku: formValue.sku,
            name: formValue.name,
            model: formValue.model || null,
            description: formValue.description || null,
            price: formValue.price,
            qtyStock: formValue.qtyStock,
            imageUrl: formValue.imageUrl || null,
            status: formValue.status,
            categories: selectedCategories
        };

        this.productService.updateProduct(this.productId, changes).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.router.navigate(['/products']);
            },
            error: (error) => {
                console.error('Error updating product:', error);
                this.isSubmitting.set(false);
            }
        });
    }

    onCancel(): void {
        this.router.navigate(['/products']);
    }

    navigateToList(): void {
        this.router.navigate(['/products']);
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.productForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    getFieldError(fieldName: string): string {
        const field = this.productForm.get(fieldName);
        if (!field || !field.errors) return '';

        if (field.errors['required']) return 'Este campo es requerido';
        if (field.errors['minlength']) return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
        if (field.errors['min']) return `El valor mínimo es ${field.errors['min'].min}`;

        return 'Campo inválido';
    }
}
