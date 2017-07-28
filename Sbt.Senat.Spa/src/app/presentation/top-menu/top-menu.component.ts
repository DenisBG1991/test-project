import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {IAppState} from '@app/store/store';
import {NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {SessionActions} from '@app/store/session/session.actions';
import {IUser} from '@app/store/user/user.model';
import {PermissionEnum} from '@app/store/permission';
import {Router} from '@angular/router';

@Component({
    selector: 'senat-topmenu',
    templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopMenuComponent implements OnInit {

    currentUser$: Observable<IUser> =
        this._ngRedux.select(x => x.currentUser);

    currentRoute$: Observable<string> = this._ngRedux.select(x => this.calculateTitle(x.router));

    canCreateIssue$: Observable<boolean> =
        this._ngRedux.select(x => x.permissions.some(p => p.permission === PermissionEnum.CreateIssue));

    canCreateMeeting$: Observable<boolean> =
        this._ngRedux.select(x => x.permissions.some(p => p.permission === PermissionEnum.CreateMeeting));

    showAdmin$: Observable<boolean> = this._ngRedux.select(x => x.permissions.some(p => p.permission === PermissionEnum.EditUserRole));

    calculateTitle(route: string): string {
        if (!route) {
            return '';
        }
        if (route.startsWith('/issues')) {
            return 'Вопросы';
        } else if (route.startsWith('/meetings')) {
            return 'Заседания';
        } else if (route.startsWith('/dashboard')) {
            return 'Дэшборд';
        } else {
            return '';
        }
    };


    constructor(private _ngRedux: NgRedux<IAppState>,
                private _sessionActions: SessionActions,
                private _router: Router) {
    }

    ngOnInit() {
    }

    logout() {
        this._ngRedux.dispatch(this._sessionActions.logout());
    }
}
