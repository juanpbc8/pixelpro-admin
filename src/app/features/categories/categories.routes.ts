import { Routes } from '@angular/router';
import { CategoriesListComponent } from './pages/list/categories-list.component';
import { CategoriesCreateComponent } from './pages/create/categories-create.component';
import { CategoriesEditComponent } from './pages/edit/categories-edit.component';

export const CATEGORIES_ROUTES: Routes = [
    {
        path: '',
        component: CategoriesListComponent
    },
    {
        path: 'new',
        component: CategoriesCreateComponent
    },
    {
        path: ':id/edit',
        component: CategoriesEditComponent
    }
];
