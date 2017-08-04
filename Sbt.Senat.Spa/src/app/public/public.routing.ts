import { ModuleWithProviders } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '@app/services/guards/auth-guard';
import {TopMenuLayoutComponent} from '@app/presentation/layouts/top-menu-layout/top-menu-layout.component';
import {TopMenuComponent} from '@app/presentation/top-menu/top-menu.component';
import {LoginComponent} from '@app/presentation/login/login.component';
import {DashboardComponent} from '@app/presentation/dashboard/dashboard.component';
import {MeetingsListComponent} from '@app/presentation/meetings-list/meetings-list.component';
import {TopMenuHeaderLayoutComponent} from '@app/presentation/layouts/top-menu-header-layout/top-menu-header-layout.component';
import {IssuesListComponent} from '@app/presentation/issue-list/issue-list.component';
import {MeetingsFilterComponent} from '@app/presentation/meetings-filter/meetings-filter.component';
import {CreateIssueComponent} from '@app/presentation/create-wizard/create-issue/create-issue.component';
import {CreateMeetingComponent} from '@app/presentation/create-wizard/create-meeting/create-meeting.component';
import {IssuePageHeaderComponent} from '@app/presentation/issue-page/issue-page-header/issue-page-header.component';
import {IssuePageContentComponent} from '@app/presentation/issue-page/issue-page-content/issue-page-content.component';
import {DownloadMobileAppComponent} from '@app/presentation/download-mobile-app/download-mobile-app.component';
import {IssuesFilterComponent} from '@app/presentation/issues-filter/issues-filter.component';
import {PublicComponent} from '@app/public/public.component';
import {CreateWizardComponent} from '@app/presentation/create-wizard/create-wizard.component';
import {DemoUiKitComponent} from '@app/presentation/demo-ui-kit/demo-ui-kit.component';
import {AgendaItemPageHeaderComponent} from '@app/presentation/meeting/agenda-item-page-header/agenda-item-page-header.component';
import {AgendaItemPageContentComponent} from '@app/presentation/meeting/agenda-item-page-content/agenda-item-page-content.component';
import {MeetingPageContentComponent} from '@app/presentation/meeting-page/meeting-page-content/meeting-page-content.component';
import {MeetingPageHeaderComponent} from '@app/presentation/meeting-page/meeting-page-header/meeting-page-header.component';


const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {
        path: 'ui-kit',
        component: DemoUiKitComponent
    },
    {
        path: 'create',
        component: CreateWizardComponent,
        canActivate: [AuthGuard]
    },
    {
        path: '',
        component: PublicComponent,
        children: [
            {
                path: '',
                children: [
                    {
                        path: 'login',
                        component: LoginComponent
                    }
                ]
            },
            {
                path: 'create/issue',
                component: CreateIssueComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'issues',
                component: TopMenuHeaderLayoutComponent,
                children: [
                    {
                        path: '',
                        outlet: 'top-menu',
                        component: TopMenuComponent
                    },
                    {
                        path: '',
                        outlet: 'header',
                        component: IssuesFilterComponent
                    },
                    {
                        path: '',
                        component: IssuesListComponent,
                        canActivate: [AuthGuard]
                    }
                ]
            },
            {
                path: 'issues/:id',
                component: TopMenuHeaderLayoutComponent,
                children: [
                    {
                        path: '',
                        outlet: 'top-menu',
                        component: TopMenuComponent
                    },
                    {
                        path: '',
                        component: IssuePageContentComponent,
                        canActivate: [AuthGuard]
                    },
                    {
                        path: '',
                        outlet: 'header',
                        component: IssuePageHeaderComponent
                    }
                ]
            },
            {
                path: '',
                component: TopMenuLayoutComponent,
                children: [
                    {
                        path: '',
                        outlet: 'top-menu',
                        component: TopMenuComponent
                    },
                    {
                        path: '',
                        children: [
                            {
                                path: '',
                                component: DashboardComponent,
                                canActivate: [AuthGuard]
                            },
                            {
                                path: 'dashboard',
                                component: DashboardComponent,
                                canActivate: [AuthGuard]
                            }
                        ]
                    }
                ]
            },
            {
                path: 'create/meeting',
                component: CreateMeetingComponent,
                canActivate: [AuthGuard]
            },
            {
                path: 'meetings',
                component: TopMenuHeaderLayoutComponent,
                children: [
                    {
                        path: '',
                        outlet: 'top-menu',
                        component: TopMenuComponent
                    },
                    {
                        path: '',
                        outlet: 'header',
                        component: MeetingsFilterComponent
                    },
                    {
                        path: '',
                        component: MeetingsListComponent,
                        canActivate: [AuthGuard]
                    }
                ]
            },
            {
                path: 'meetings/:id',
                component: TopMenuHeaderLayoutComponent,
                children: [
                    {
                        path: '',
                        outlet: 'top-menu',
                        component: TopMenuComponent
                    },
                    {
                        path: '',
                        outlet: 'header',
                        component: MeetingPageHeaderComponent
                    },
                    {
                        path: '',
                        children: [
                            {
                                path: '',
                                component: MeetingPageContentComponent,
                                canActivate: [AuthGuard]
                            }
                        ]
                    }
                ]
            },
            {
                path: 'meetings/:meetingId/agenda/:issueId',
                component: TopMenuHeaderLayoutComponent,
                children: [
                    {
                        path: '',
                        outlet: 'top-menu',
                        component: TopMenuComponent
                    },
                    {
                        path: '',
                        outlet: 'header',
                        component: AgendaItemPageHeaderComponent
                    },
                    {
                        path: '',
                        children: [
                            {
                                path: '',
                                component: AgendaItemPageContentComponent,
                                canActivate: [AuthGuard]
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        path: 'ipad',
        component: DownloadMobileAppComponent
    }
];

export const routingPublic: ModuleWithProviders = RouterModule.forChild(routes);
