import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../categories/models/category.model';
import { CreateProductDto } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { UploadService } from '../../../../../shared/services/upload.service';

@Component({
    selector: 'app-product-create',
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './product-create.component.html',
    styleUrl: './product-create.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCreateComponent implements OnInit {
    private readonly productService = inject(ProductService);
    private readonly categoryService = inject(CategoryService);
    private readonly uploadService = inject(UploadService);
    private readonly router = inject(Router);
    private readonly fb = inject(FormBuilder);

    readonly categories = signal<Category[]>([]);
    readonly isSubmitting = signal<boolean>(false);
    readonly errorMessage = signal<string>('');
    readonly selectedFile = signal<File | null>(null);
    readonly imagePreview = signal<string | null>(null);
    readonly isUploading = signal<boolean>(false);
    readonly productForm: FormGroup;

    constructor() {
        this.productForm = this.fb.group({
            sku: ['', [Validators.required, Validators.minLength(3)]],
            name: ['', [Validators.required, Validators.minLength(3)]],
            model: [''],
            description: [''],
            price: [0, [Validators.required, Validators.min(0)]],
            qtyStock: [0, [Validators.required, Validators.min(0)]],
            status: ['ACTIVO', Validators.required],
            categoryId: [null, Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadCategories();
    }

    loadCategories(): void {
        this.categoryService.getCategories().subscribe({
            next: (categories) => {
                this.categories.set(categories);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading categories:', err);
                this.errorMessage.set(err.error?.message || 'Error al cargar categorías');
            }
        });
    }



    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.selectedFile.set(file);

            // Generar preview local
            const reader = new FileReader();
            reader.onload = (e) => {
                this.imagePreview.set(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    }

    removeImage(): void {
        this.selectedFile.set(null);
        this.imagePreview.set(null);
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        const file = this.selectedFile();
        if (!file) {
            this.errorMessage.set('Debe seleccionar una imagen para el producto');
            return;
        }

        const formValue = this.productForm.value;
        const categoryId: number = formValue.categoryId;

        if (!categoryId) {
            this.errorMessage.set('Debe seleccionar una categoría');
            return;
        }

        this.isSubmitting.set(true);
        this.isUploading.set(true);
        this.errorMessage.set('');

        const dto: CreateProductDto = {
            sku: formValue.sku,
            name: formValue.name,
            model: formValue.model || undefined,
            description: formValue.description || undefined,
            price: formValue.price,
            qtyStock: formValue.qtyStock,
            status: formValue.status,
            categoryId: categoryId
        };

        // Usar el método del servicio que orquesta upload + create
        this.productService.createProductWithImage(dto, file).subscribe({
            next: () => {
                this.isSubmitting.set(false);
                this.isUploading.set(false);
                this.router.navigate(['/products']);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error creating product:', err);
                this.errorMessage.set(err.error?.message || 'Error al crear el producto');
                this.isSubmitting.set(false);
                this.isUploading.set(false);
            }
        });
    }

    onCancel(): void {
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
