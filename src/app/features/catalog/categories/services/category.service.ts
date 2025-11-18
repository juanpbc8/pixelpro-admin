import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {
    private nextId = 9;

    private readonly categories = signal<Category[]>([
        {
            id: 1,
            name: 'Electrónica',
            parentCategoryId: null,
            createdAt: '2024-01-10T08:00:00Z',
            updatedAt: '2024-11-01T10:00:00Z'
        },
        {
            id: 2,
            name: 'Ropa',
            parentCategoryId: null,
            createdAt: '2024-01-12T09:30:00Z',
            updatedAt: '2024-11-05T15:20:00Z'
        },
        {
            id: 3,
            name: 'Hogar',
            parentCategoryId: null,
            createdAt: '2024-01-15T10:00:00Z',
            updatedAt: '2024-10-28T11:45:00Z'
        },
        {
            id: 4,
            name: 'Deportes',
            parentCategoryId: null,
            createdAt: '2024-02-01T11:15:00Z',
            updatedAt: '2024-11-10T09:30:00Z'
        },
        {
            id: 5,
            name: 'Computadoras',
            parentCategoryId: 1,
            createdAt: '2024-02-10T14:00:00Z',
            updatedAt: '2024-11-12T16:00:00Z'
        },
        {
            id: 6,
            name: 'Smartphones',
            parentCategoryId: 1,
            createdAt: '2024-02-15T15:30:00Z',
            updatedAt: '2024-11-14T10:15:00Z'
        },
        {
            id: 7,
            name: 'Ropa Deportiva',
            parentCategoryId: 2,
            createdAt: '2024-03-01T10:00:00Z',
            updatedAt: '2024-11-08T12:00:00Z'
        },
        {
            id: 8,
            name: 'Muebles',
            parentCategoryId: 3,
            createdAt: '2024-03-10T11:45:00Z',
            updatedAt: '2024-11-06T14:30:00Z'
        }
    ]);

    readonly allCategories = computed(() => this.categories());

    getCategories(): Observable<Category[]> {
        return of(this.categories()).pipe(delay(300));
    }

    getCategoryById(id: number): Observable<Category | undefined> {
        const category = this.categories().find(c => c.id === id);
        return of(category).pipe(delay(300));
    }

    createCategory(category: Category): Observable<Category> {
        const newCategory: Category = {
            ...category,
            id: this.nextId++,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.categories.update(categories => [...categories, newCategory]);
        return of(newCategory).pipe(delay(300));
    }

    updateCategory(id: number, changes: Partial<Category>): Observable<Category | undefined> {
        const index = this.categories().findIndex(c => c.id === id);

        if (index === -1) {
            return of(undefined).pipe(delay(300));
        }

        const updatedCategory: Category = {
            ...this.categories()[index],
            ...changes,
            id,
            updatedAt: new Date().toISOString()
        };

        this.categories.update(categories => {
            const newCategories = [...categories];
            newCategories[index] = updatedCategory;
            return newCategories;
        });

        return of(updatedCategory).pipe(delay(300));
    }

    deleteCategory(id: number): Observable<void> {
        this.categories.update(categories => categories.filter(c => c.id !== id));
        return of(void 0).pipe(delay(300));
    }

    getParentCategories(): Observable<Category[]> {
        return of(this.categories()).pipe(delay(200));
    }

    getCategoryNameById(id: number | null | undefined): string {
        if (!id) return 'Ninguna';
        const category = this.categories().find(c => c.id === id);
        return category?.name || 'Desconocida';
    }
}
