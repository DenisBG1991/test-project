import {NgModule} from '@angular/core';
import {CommonTestModule} from '@test/common.test.module';
import {DashboardComponent} from './dashboard.component';

// import { StatusIndicatorTestModule } from '../status-indicator/status-indicator.test.module';

@NgModule({
    exports: [
        DashboardComponent
    ],
    imports: [
        CommonTestModule
        // StatusIndicatorTestModule
    ],
    declarations: [
        DashboardComponent
    ],
    providers: []
})
export class DashboardTestModule {
}
