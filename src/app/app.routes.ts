import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'dashboard',
                loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
            },
            {
                path: 'products',
                loadChildren: () => import('./features/catalog/products/products.routes').then(m => m.PRODUCTS_ROUTES)
            },
            {
                path: 'categories',
                loadChildren: () => import('./features/catalog/categories/categories.routes').then(m => m.CATEGORIES_ROUTES)
            },
            {
                path: 'orders',
                loadChildren: () => import('./features/orders/orders.routes').then(m => m.ORDERS_ROUTES)
            },
            {
                path: 'customers',
                loadChildren: () => import('./features/customers/customers.routes').then(m => m.CUSTOMERS_ROUTES)
            },
            {
                path: 'users',
                loadChildren: () => import('./features/users/users.routes').then(m => m.USERS_ROUTES)
            },
            {
                path: 'settings',
                loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
