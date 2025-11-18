import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/general/settings-general.component').then(m => m.SettingsGeneralComponent)
    }
];
