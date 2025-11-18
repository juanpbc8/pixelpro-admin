import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/list/categories-list.component').then(m => m.CategoriesListComponent)
    }
];
