import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminComponent } from '@app/admin/admin.component';

import { AdminMenuLayoutComponent } from '@app/presentation/layouts/admin-menu-layout/admin-menu-layout.component';
import { AdminMenuComponent } from '@app/presentation/admin-menu/admin-menu.component';
import { CreatePersonComponent } from '@app/presentation/create-person/create-person.component';
import { CreateAdPersonComponent } from '@app/presentation/create-ad-person/create-ad-person.component';
import { PersonComponent } from '@app/presentation/person/person.component';

import { AuthGuard } from '@app/services/guards/auth-guard';

const routes: Routes = [
    {
        path: '',
        component: AdminComponent,
        children: [
            {
                path: '',
                component: AdminMenuLayoutComponent,
                children: [
                    {
                        path: '',
                        outlet: 'top-menu',
                        component: AdminMenuComponent
                    },
                    {
                        path: 'person/new',
                        component: CreatePersonComponent
                        // canActivate: [AuthGuard]
                    },
                    {
                        path: 'person/newad',
                        component: CreateAdPersonComponent
                        // canActivate: [AuthGuard]
                    },
                    {
                        path: 'person/:id',
                        component: PersonComponent
                        // canActivate: [AuthGuard]
                    }
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AdminRoutingModule {}
