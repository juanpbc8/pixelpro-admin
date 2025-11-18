import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/list/orders-list.component').then(m => m.OrdersListComponent)
    },
    {
        path: ':id',
        loadComponent: () => import('./pages/detail/order-detail.component').then(m => m.OrderDetailComponent)
    }
];
