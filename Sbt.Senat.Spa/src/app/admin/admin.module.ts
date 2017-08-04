import { NgModule } from '@angular/core';

import { AdminComponent } from '@app/admin/admin.component';
import { routingAdmin } from '@app/admin/admin.routing';

import { StoreModule } from '@app/store/admin/store.module';

import { AdminMenuComponent } from '@app/presentation/admin-menu/admin-menu.component';
import { CreateAdPersonComponent } from '@app/presentation/create-ad-person/create-ad-person.component';
import { CreatePersonComponent } from '@app/presentation/create-person/create-person.component';
import { CreateUserRoleComponent } from '@app/presentation/create-user-role/create-user-role.component';
import { AdminMenuLayoutComponent } from '@app/presentation/layouts/admin-menu-layout/admin-menu-layout.component';
import { PersonComponent } from '@app/presentation/person/person.component';
import { PersonDetailsComponent } from '@app/presentation/person/person-details/person-details.component';
import { PersonDetailsFormComponent } from '@app/presentation/person/person-details-form/person-details-form.component';
import { AdUserComponent } from '@app/presentation/user/ad-user/ad-user.component';
import { UserRoleListComponent } from '@app/presentation/user-role-list/user-role-list.component';

import { SharedModule } from '@app/shared/shared.module';
import { AccountClient, CompaniesClient, HoldingsClient, UserClient } from '@app/shared/api';

import { UserService } from '@app/services/api/user.service';
import { ApiService } from '@app/services/api/api.service';
import { CompanyService } from '@app/services/api/company.service';
import { HoldingService } from '@app/services/api/holding.service';
import { HttpUrlWrappingDecorator } from '@app/services/api/http-url-wrapping-decorator';
import { LoadDataService } from '@app/presentation/admin-menu/admin-menu.service';

@NgModule({
    declarations: [
        AdminComponent,
        AdminMenuComponent,
        CreateAdPersonComponent,
        CreatePersonComponent,
        CreateUserRoleComponent,
        AdminMenuLayoutComponent,
        PersonComponent,
        PersonDetailsComponent,
        PersonDetailsFormComponent,
        AdUserComponent,
        UserRoleListComponent
    ],
    imports: [
        routingAdmin,
        SharedModule,
        StoreModule
    ],
    providers: [
        AccountClient,
        CompaniesClient,
        HoldingsClient,
        UserClient,
        UserService,
        CompanyService,
        HoldingService,
        ApiService,
        HttpUrlWrappingDecorator,
        LoadDataService
    ]
})
export class AdminModule {}
