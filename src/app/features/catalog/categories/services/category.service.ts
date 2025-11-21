import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../models/category.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.apiUrl}/api/admin/categories`;

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.baseUrl);
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
