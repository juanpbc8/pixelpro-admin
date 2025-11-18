import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/list/product-list.component';
import { ProductCreateComponent } from './pages/create/product-create.component';
import { ProductEditComponent } from './pages/edit/product-edit.component';
import { ProductDetailsComponent } from './pages/details/product-details.component';

export const PRODUCTS_ROUTES: Routes = [
    {
        path: '',
        component: ProductListComponent
    },
    {
        path: 'new',
        component: ProductCreateComponent
    },
    {
        path: ':id/edit',
        component: ProductEditComponent
    },
    {
        path: ':id',
        component: ProductDetailsComponent
    }
];
