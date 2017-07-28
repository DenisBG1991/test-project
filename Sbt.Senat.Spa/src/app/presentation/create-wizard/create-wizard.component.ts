import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import {PermissionEnum} from '@app/store/permission';
import {Router} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {ControlsLayoutActions} from '@app/store/layout/layout.actions';
import {IAppState} from '@app/store/store';
import {BackNavigationService} from '@app/services/back-navigation.service';

@Component({
    selector: 'senat-create-wizard',
    templateUrl: './create-wizard.component.html',
    styleUrls: ['./create-wizard.component.css']
})
export class CreateWizardComponent implements OnInit {

    canCreateIssue$: Observable<boolean> =
        this._ngRedux.select(x => x.permissions.some(p => p.permission === PermissionEnum.CreateIssue));

    canCreateMeeting$: Observable<boolean> =
        this._ngRedux.select(x => x.permissions.some(p => p.permission === PermissionEnum.CreateMeeting));

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _actions: ControlsLayoutActions,
                private _router: Router,
                private _backNavigationService: BackNavigationService,
                private _location: Location) {
    }

    ngOnInit() {
    }

    toggle() {
        this._ngRedux.dispatch(this._actions.toggleItems());
    }

    createIssue() {
        this._router.navigate(['/create/issue']);
        this.toggle();
    }

    createMeeting() {
        this._router.navigate(['/create/meeting']);
        this.toggle();
    }

    back() {
        this._location.back();
    }

    close() {
        this._backNavigationService.navigateBack();
    }
}
