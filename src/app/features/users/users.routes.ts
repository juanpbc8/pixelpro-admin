import { Routes } from '@angular/router';
import { UsersListComponent } from './pages/users-list/users-list.component';
import { UserCreateComponent } from './pages/user-create/user-create.component';
import { UserDetailComponent } from './pages/user-detail/user-detail.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { RolesListComponent } from './pages/roles-list/roles-list.component';

export const USERS_ROUTES: Routes = [
    {
        path: '',
        component: UsersListComponent
    },
    {
        path: 'new',
        component: UserCreateComponent
    },
    {
        path: 'roles/list',
        component: RolesListComponent
    },
    {
        path: ':id/edit',
        component: UserEditComponent
    },
    {
        path: ':id',
        component: UserDetailComponent
    }
];
