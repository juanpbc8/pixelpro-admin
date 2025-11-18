import { Component, ChangeDetectionStrategy, signal, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-details',
    imports: [CommonModule],
    templateUrl: './product-details.component.html',
    styleUrl: './product-details.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent implements OnInit {
    private readonly productService = inject(ProductService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    readonly product = signal<Product | null>(null);
    readonly isLoading = signal<boolean>(true);
    readonly notFound = signal<boolean>(false);

    private productId: number = 0;

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.productId = +params['id'];
            if (this.productId) {
                this.loadProduct();
            }
        });
    }

    loadProduct(): void {
        this.isLoading.set(true);
        this.productService.getProductById(this.productId).subscribe({
            next: (product) => {
                if (product) {
                    this.product.set(product);
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

    navigateToEdit(): void {
        this.router.navigate(['/products', this.productId, 'edit']);
    }

    navigateToList(): void {
        this.router.navigate(['/products']);
    }

    formatPrice(price: number): string {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    }

    formatDate(dateString?: string): string {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    getCategoryNames(): string {
        const product = this.product();
        if (!product || !product.categories.length) return 'Sin categorías';
        return product.categories.map(c => c.name).join(', ');
    }
}
