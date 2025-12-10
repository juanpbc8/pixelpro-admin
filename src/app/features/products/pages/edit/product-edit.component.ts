import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Product, UpdateProductDto } from '../../models/product.model';
import { Category } from '../../../categories/models/category.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../../categories/services/category.service';
import { UploadService } from '../../../../shared/services/upload.service';
import { ImageUrlPipe } from '../../../../shared/pipes/image-url.pipe';

@Component({
    selector: 'app-product-edit',
    imports: [CommonModule, ReactiveFormsModule, ImageUrlPipe],
    templateUrl: './product-edit.component.html',
    styleUrl: './product-edit.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductEditComponent implements OnInit {
    private readonly productService = inject(ProductService);
    private readonly categoryService = inject(CategoryService);
    private readonly uploadService = inject(UploadService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly fb = inject(FormBuilder);

    readonly product = signal<Product | null>(null);
    readonly categories = signal<Category[]>([]);
    readonly isLoading = signal<boolean>(true);
    readonly isSubmitting = signal<boolean>(false);
    readonly notFound = signal<boolean>(false);
    readonly errorMessage = signal<string>('');
    readonly selectedFile = signal<File | null>(null);
    readonly imagePreview = signal<string | null>(null);
    readonly originalImageUrl = signal<string | null>(null);
    readonly isUploading = signal<boolean>(false);
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
            status: ['ACTIVO', Validators.required],
            categoryId: [null, Validators.required]
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
                this.product.set(product);
                this.patchForm(product);
                this.notFound.set(false);
                this.isLoading.set(false);
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading product:', err);
                this.errorMessage.set(err.error?.message || 'Error al cargar el producto');
                this.notFound.set(true);
                this.isLoading.set(false);
            }
        });
    }

    loadCategories(): void {
        // Cargar un gran número de categorías para el dropdown
        this.categoryService.getCategories({ page: 0, size: 100 }).subscribe({
            next: (page) => {
                this.categories.set(page.content); // Usar page.content, no page directamente
            },
            error: (err: HttpErrorResponse) => {
                console.error('Error loading categories:', err);
                this.errorMessage.set(err.error?.message || 'Error al cargar categorías');
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
            status: product.status,
            categoryId: product.category?.id || null
        });

        // Establecer imagen original y preview
        this.originalImageUrl.set(product.imageUrl || null);
        this.imagePreview.set(product.imageUrl || null);
    }

    onImageSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];

            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                this.errorMessage.set('Por favor selecciona un archivo de imagen válido');
                return;
            }

            this.selectedFile.set(file);

            // Generar preview local usando FileReader
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const result = e.target?.result as string;
                this.imagePreview.set(result);
            };
            reader.onerror = () => {
                this.errorMessage.set('Error al leer la imagen seleccionada');
            };
            reader.readAsDataURL(file);
        }
    }

    removeNewImage(): void {
        this.selectedFile.set(null);
        // Restaurar imagen original
        this.imagePreview.set(this.originalImageUrl());
        // Limpiar el input file
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    isDataUrl(url: string | null): boolean {
        return url !== null && url.startsWith('data:');
    }

    onSubmit(): void {
        if (this.productForm.invalid) {
            this.productForm.markAllAsTouched();
            return;
        }

        const formValue = this.productForm.value;
        const categoryId: number = formValue.categoryId;

        if (!categoryId) {
            this.errorMessage.set('Debe seleccionar una categoría');
            return;
        }

        this.isSubmitting.set(true);
        this.errorMessage.set('');

        const dto: UpdateProductDto = {
            name: formValue.name,
            model: formValue.model || undefined,
            description: formValue.description || undefined,
            price: formValue.price,
            qtyStock: formValue.qtyStock,
            status: formValue.status,
            categoryId: categoryId
        };

        const file = this.selectedFile();

        if (file) {
            // Usuario seleccionó nueva imagen: usar updateProductWithImage
            this.isUploading.set(true);
            this.productService.updateProductWithImage(this.productId, dto, file).subscribe({
                next: () => {
                    this.isSubmitting.set(false);
                    this.isUploading.set(false);
                    this.router.navigate(['/products']);
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Error updating product:', err);
                    this.errorMessage.set(err.error?.message || 'Error al actualizar el producto');
                    this.isSubmitting.set(false);
                    this.isUploading.set(false);
                }
            });
        } else {
            // Mantener imagen original: incluir imageUrl en DTO
            dto.imageUrl = this.originalImageUrl() || undefined;
            this.productService.updateProduct(this.productId, dto).subscribe({
                next: () => {
                    this.isSubmitting.set(false);
                    this.router.navigate(['/products']);
                },
                error: (err: HttpErrorResponse) => {
                    console.error('Error updating product:', err);
                    this.errorMessage.set(err.error?.message || 'Error al actualizar el producto');
                    this.isSubmitting.set(false);
                }
            });
        }
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
