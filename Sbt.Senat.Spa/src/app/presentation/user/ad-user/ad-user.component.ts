import {Component, Input, OnDestroy, OnInit} from '@angular/core';

import {IPersonRef} from '@app/store/person/person.model';
import {NgRedux} from '@angular-redux/store';
import {UserActions} from '@app/store/admin/user/user.actions';
import IAdminState from '@app/store/admin/store.model';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'senat-ad-user',
    templateUrl: './ad-user.component.html',
    styleUrls: ['./ad-user.component.css']
})
export class AdUserComponent implements OnInit, OnDestroy {

    @Input()
    person: IPersonRef;
    adLogin: string;

    private _subscriptions: Subscription[];

    constructor(private _ngRedux: NgRedux<IAdminState>, private _userActions: UserActions) {
    }

    ngOnInit() {
        this._subscriptions = [
            this._ngRedux.select(x => x.users.filter(u => u.person.id === this.person.id && u.authMethods && u.authMethods['ad'])).subscribe(su => {
                if (su.length) {
                    this.adLogin = su[0].authMethods['ad'];
                }
            })
        ];
    }

    save() {
        this._ngRedux.dispatch(this._userActions.createAdUser(
            this.person,
            this.adLogin
        ));
    }

    ngOnDestroy() {
        this._subscriptions.forEach(s => s.unsubscribe());
    }
}
