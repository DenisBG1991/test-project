import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {IAppState} from '@app/store/store';
import {NgRedux} from '@angular-redux/store';

import 'rxjs/add/operator/first';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private _ngRedux: NgRedux<IAppState>, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot,
                state: RouterStateSnapshot) {

        return this._ngRedux.select(x => x.currentUser)
            .map(user => {
                if (state.url !== '/login' && user == null) {
                    this.router.navigate(['/login']);
                    // this.securityService.redirectUrl = state.url;
                    return false;
                }
                return true;
            })
            .first();
    }
}
