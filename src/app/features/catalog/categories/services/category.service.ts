import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryDto, UpdateCategoryDto, CategoryQueryParams } from '../models/category.model';
import { Page } from '../../../../shared/models/page.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/admin/categories`;

    /**
     * Obtiene la lista paginada de categorías
     * @param params Parámetros de consulta (page, size, sort, parentId)
     * @returns Observable con la página de categorías
     */
    getCategories(params: CategoryQueryParams = {}): Observable<Page<Category>> {
        let httpParams = new HttpParams();

        if (params.page !== undefined) {
            httpParams = httpParams.set('page', params.page.toString());
        }

        if (params.size !== undefined) {
            httpParams = httpParams.set('size', params.size.toString());
        }

        if (params.sort) {
            httpParams = httpParams.set('sort', params.sort);
        }

        if (params.parentId !== undefined) {
            httpParams = httpParams.set('parentId', params.parentId.toString());
        }

        return this.http.get<Page<Category>>(this.baseUrl, { params: httpParams });
    }

    getCategoryById(id: number): Observable<Category> {
        return this.http.get<Category>(`${this.baseUrl}/${id}`);
    }

    createCategory(dto: CreateCategoryDto): Observable<Category> {
        return this.http.post<Category>(this.baseUrl, dto);
    }

    updateCategory(id: number, dto: UpdateCategoryDto): Observable<Category> {
        return this.http.put<Category>(`${this.baseUrl}/${id}`, dto);
    }

    deleteCategory(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}
