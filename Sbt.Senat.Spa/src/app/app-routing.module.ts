import {Routes, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

const routes: Routes = [
    { path: '', loadChildren: 'app/public/public.module#PublicModule' },
    { path: 'admin', loadChildren: 'app/admin/admin.module#AdminModule' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}

