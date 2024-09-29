import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/feature-2/feature-2.component').then(m => m.Feature2Component),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
