import {NgModule} from '@angular/core';
import {TruncatePipe} from '@app/presentation/pipes/truncate.pipe';
import {MomentPipe} from '@app/presentation/pipes/moment.pipe';

@NgModule({
    declarations: [
        TruncatePipe,
        MomentPipe
    ],
    exports: [
        TruncatePipe,
        MomentPipe
    ]
})
export class PipesModule {

}
