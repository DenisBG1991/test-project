import {Injectable} from '@angular/core';
import {IAppState} from '@app/store/store';
import {NgRedux} from '@angular-redux/store';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

@Injectable()
export class BackNavigationService {

    constructor(private _location: Location, private _router: Router, private _ngRedux: NgRedux<IAppState>) {
    }

    navigateBack(backStep: number = 1) {
        const routerHistory = this._ngRedux.getState().routerHistory;
        // required count of router navigation for making navigation by back service, or navigate to webSite root
        const requiredRoutersCount = backStep + 1;
        if (routerHistory.length < requiredRoutersCount) {
            this._router.navigate(['']);
        } else {
            for (let i = 0; i < backStep; i++) {
                this._location.back();
            }
        }
    }
}
