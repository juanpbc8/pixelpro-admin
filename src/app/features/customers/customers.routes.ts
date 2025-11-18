import { Routes } from '@angular/router';
import { CustomersListComponent } from './pages/list/customers-list.component';
import { CustomerDetailComponent } from './pages/detail/customer-detail.component';

export const CUSTOMERS_ROUTES: Routes = [
    {
        path: '',
        component: CustomersListComponent
    },
    {
        path: ':id',
        component: CustomerDetailComponent
    }
];
