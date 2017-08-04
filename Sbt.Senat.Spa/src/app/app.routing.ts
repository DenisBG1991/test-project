import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

const routes: Routes = [
    { path: '', loadChildren: 'app/public/public.module#PublicModule'},
    { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' }
];

export const routingApp: ModuleWithProviders = RouterModule.forRoot(routes);
