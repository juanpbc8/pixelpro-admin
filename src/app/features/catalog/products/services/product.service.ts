import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Product, CreateProductDto, UpdateProductDto, ProductQueryParams, Page } from '../models/product.model';
import { environment } from '../../../../../environments/environment';
import { UploadService } from '../../../common/services/upload.service';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private readonly http = inject(HttpClient);
    private readonly uploadService = inject(UploadService);
    private readonly baseUrl = `${environment.apiUrl}/api/admin/products`;

    getProducts(params: ProductQueryParams = {}): Observable<Page<Product>> {
        const httpParams = this.buildQueryParams(params);
        return this.http.get<Page<Product>>(this.baseUrl, { params: httpParams });
    }

    getProductById(id: number): Observable<Product> {
        return this.http.get<Product>(`${this.baseUrl}/${id}`);
    }

    createProduct(dto: CreateProductDto): Observable<Product> {
        return this.http.post<Product>(this.baseUrl, dto);
    }

    updateProduct(id: number, dto: UpdateProductDto): Observable<Product> {
        return this.http.put<Product>(`${this.baseUrl}/${id}`, dto);
    }

    /**
     * Crea un producto con imagen.
     * Primero sube la imagen, luego crea el producto con la URL retornada.
     */
    createProductWithImage(productData: CreateProductDto, imageFile: File): Observable<Product> {
        return this.uploadService.uploadProductImage(imageFile).pipe(
            switchMap((imageUrl: string) => {
                const productWithImage: CreateProductDto = {
                    ...productData,
                    imageUrl
                };
                return this.createProduct(productWithImage);
            })
        );
    }

    /**
     * Actualiza un producto con opción de cambiar imagen.
     * Si se proporciona imageFile, primero lo sube y luego actualiza el producto.
     * Si no hay imageFile, actualiza directamente con los datos proporcionados.
     */
    updateProductWithImage(id: number, productData: UpdateProductDto, imageFile?: File): Observable<Product> {
        if (imageFile) {
            return this.uploadService.uploadProductImage(imageFile).pipe(
                switchMap((imageUrl: string) => {
                    const productWithImage: UpdateProductDto = {
                        ...productData,
                        imageUrl
                    };
                    return this.updateProduct(id, productWithImage);
                })
            );
        } else {
            return this.updateProduct(id, productData);
        }
    }

    deleteProduct(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }

    buildQueryParams(filters: ProductQueryParams): HttpParams {
        let params = new HttpParams();

        if (filters.name) {
            params = params.set('name', filters.name);
        }
        if (filters.sku) {
            params = params.set('sku', filters.sku);
        }
        if (filters.status) {
            params = params.set('status', filters.status);
        }
        if (filters.categoryId !== undefined && filters.categoryId !== null) {
            params = params.set('categoryId', filters.categoryId.toString());
        }
        if (filters.page !== undefined) {
            params = params.set('page', filters.page.toString());
        }
        if (filters.size !== undefined) {
            params = params.set('size', filters.size.toString());
        }
        if (filters.sort) {
            params = params.set('sort', filters.sort);
        }

        return params;
    }
}
