import {NgModule} from '@angular/core';

import {LabelsClient} from '@app/shared/api/client/reference/api.reference';
import {AutoCompleteModule} from 'primeng/primeng';

@NgModule({
    exports: [
    ],
    imports: [
        AutoCompleteModule
    ],
    declarations: [
    ],
    providers: [
        LabelsClient,
    ]
})
export class LabelsTestModule {
}
