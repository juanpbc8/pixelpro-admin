import { Routes } from '@angular/router';

export const USERS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/list/users-list.component').then(m => m.UsersListComponent)
    },
    {
        path: 'roles',
        loadComponent: () => import('./pages/roles/roles-list.component').then(m => m.RolesListComponent)
    }
];
