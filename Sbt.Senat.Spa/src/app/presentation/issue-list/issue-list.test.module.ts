import {NgModule} from '@angular/core';
import {IssuesListComponent} from './issue-list.component';
import {IssuesClient} from '@app/shared/api';

@NgModule({
    exports: [
        IssuesListComponent,
    ],
    imports: [
    ],
    declarations: [
        IssuesListComponent,
    ],
    providers: [
        IssuesClient,
    ]
})
export class IssuesListTestModule {
}
