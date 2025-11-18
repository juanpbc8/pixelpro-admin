import { Routes } from '@angular/router';
import { OrdersListComponent } from './pages/list/orders-list.component';
import { OrderDetailComponent } from './pages/detail/order-detail.component';

export const ORDERS_ROUTES: Routes = [
    {
        path: '',
        component: OrdersListComponent
    },
    {
        path: ':id',
        component: OrderDetailComponent
    }
];
