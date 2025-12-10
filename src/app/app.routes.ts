import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        component: AuthLayoutComponent,
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/pages/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [authGuard],
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
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'auth/login'
    }
];
