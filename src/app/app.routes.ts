import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/feature-1/feature-1.component').then(m => m.Feature1Component),
    },
    {
        path: '**',
        redirectTo: '',
    },
];
