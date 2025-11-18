import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private nextId = 6;

    private mockCategories: Category[] = [
        { id: 1, name: 'Electrónica', parentCategoryId: null },
        { id: 2, name: 'Ropa', parentCategoryId: null },
        { id: 3, name: 'Hogar', parentCategoryId: null },
        { id: 4, name: 'Deportes', parentCategoryId: null },
        { id: 5, name: 'Computadoras', parentCategoryId: 1 },
        { id: 6, name: 'Smartphones', parentCategoryId: 1 }
    ];

    private readonly products = signal<Product[]>([
        {
            id: 1,
            sku: 'LAPTOP-001',
            name: 'Laptop HP Pavilion',
            model: 'HP-15-DY2021',
            description: 'Laptop de alto rendimiento con procesador Intel Core i7, 16GB RAM, 512GB SSD',
            price: 899.99,
            imageUrl: 'https://via.placeholder.com/300x300?text=Laptop+HP',
            status: 'ACTIVE',
            qtyStock: 15,
            categories: [this.mockCategories[0], this.mockCategories[4]],
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-11-10T14:20:00Z'
        },
        {
            id: 2,
            sku: 'PHONE-002',
            name: 'Samsung Galaxy S23',
            model: 'SM-S911B',
            description: 'Smartphone con pantalla AMOLED de 6.1", cámara de 50MP, 256GB',
            price: 799.99,
            imageUrl: 'https://via.placeholder.com/300x300?text=Galaxy+S23',
            status: 'ACTIVE',
            qtyStock: 30,
            categories: [this.mockCategories[0], this.mockCategories[5]],
            createdAt: '2024-02-20T09:15:00Z',
            updatedAt: '2024-11-12T16:45:00Z'
        },
        {
            id: 3,
            sku: 'DESK-003',
            name: 'Escritorio Ejecutivo',
            model: 'EXEC-2024',
            description: 'Escritorio de madera con acabado en nogal, 150x75cm',
            price: 349.99,
            imageUrl: null,
            status: 'ACTIVE',
            qtyStock: 8,
            categories: [this.mockCategories[2]],
            createdAt: '2024-03-10T11:00:00Z',
            updatedAt: '2024-11-01T10:30:00Z'
        },
        {
            id: 4,
            sku: 'SHIRT-004',
            name: 'Camisa Polo Nike',
            model: 'NK-POLO-2024',
            description: 'Camisa deportiva de algodón, talla M, color azul marino',
            price: 45.99,
            imageUrl: 'https://via.placeholder.com/300x300?text=Polo+Nike',
            status: 'INACTIVE',
            qtyStock: 0,
            categories: [this.mockCategories[1], this.mockCategories[3]],
            createdAt: '2024-04-05T08:20:00Z',
            updatedAt: '2024-10-25T12:10:00Z'
        },
        {
            id: 5,
            sku: 'BIKE-005',
            name: 'Bicicleta de Montaña',
            model: 'MTB-PRO-2024',
            description: 'Bicicleta con suspensión completa, 21 velocidades, rodada 29"',
            price: 599.99,
            imageUrl: 'https://via.placeholder.com/300x300?text=MTB',
            status: 'ACTIVE',
            qtyStock: 5,
            categories: [this.mockCategories[3]],
            createdAt: '2024-05-12T14:30:00Z',
            updatedAt: '2024-11-15T09:00:00Z'
        }
    ]);

    readonly allProducts = computed(() => this.products());
    readonly allCategories = computed(() => this.mockCategories);

    getProducts(): Observable<Product[]> {
        return of(this.products()).pipe(delay(300));
    }

    getProductById(id: number): Observable<Product | undefined> {
        const product = this.products().find(p => p.id === id);
        return of(product).pipe(delay(300));
    }

    createProduct(product: Product): Observable<Product> {
        const newProduct: Product = {
            ...product,
            id: this.nextId++,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.products.update(products => [...products, newProduct]);
        return of(newProduct).pipe(delay(300));
    }

    updateProduct(id: number, changes: Partial<Product>): Observable<Product | undefined> {
        const index = this.products().findIndex(p => p.id === id);

        if (index === -1) {
            return of(undefined).pipe(delay(300));
        }

        const updatedProduct: Product = {
            ...this.products()[index],
            ...changes,
            id,
            updatedAt: new Date().toISOString()
        };

        this.products.update(products => {
            const newProducts = [...products];
            newProducts[index] = updatedProduct;
            return newProducts;
        });

        return of(updatedProduct).pipe(delay(300));
    }

    deleteProduct(id: number): Observable<void> {
        this.products.update(products => products.filter(p => p.id !== id));
        return of(void 0).pipe(delay(300));
    }

    getCategories(): Observable<Category[]> {
        return of(this.mockCategories).pipe(delay(200));
    }
}
