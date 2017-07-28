import { NgModule } from '@angular/core';
import { CommonTestModule } from '@test/common.test.module';
import { CalendarModule } from 'primeng/primeng';

import { DurationComponent } from './duration.component';
@NgModule({
    exports: [
        DurationComponent
    ],
    imports: [
        CommonTestModule,
        CalendarModule
    ],
    declarations: [
        DurationComponent
    ],
    providers: []
})
export class DurationTestModule {
}
