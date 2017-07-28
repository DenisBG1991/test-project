import {IPersonLayoutState} from '@app/store/admin/layout/person-layout-state.model';
import {FormGroup} from '@angular/forms';

export interface ILayoutState {
    person: IPersonLayoutState;
    createPersonForm: FormGroup,
    personForm: FormGroup
}
