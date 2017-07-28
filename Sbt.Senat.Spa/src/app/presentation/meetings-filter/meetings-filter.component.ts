import {Component, OnDestroy, OnInit} from '@angular/core';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {IAppState} from '@app/store/store';
import {NgRedux} from '@angular-redux/store';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {IMeetingsFilter} from '@app/store/meeting/meetings-filter.model';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';

@Component({
    selector: 'senat-meetings-filter',
    templateUrl: './meetings-filter.component.html',
    styleUrls: ['./meetings-filter.component.css']
})
export class MeetingsFilterComponent implements OnInit, OnDestroy {

    collapsed = true;
    filter: IMeetingsFilter;

    private _subscription: Subscription;
    collegialBodies$: Observable<Array<ICollegialBody>> = this._ngRedux
        .select(this._permissionSelectors.collegialBodyChildPermissionsFilter([
            PermissionEnum.ViewMeeting,
            PermissionEnum.ViewIssue]));


    constructor(private _ngRedux: NgRedux<IAppState>,
                private _collegialBodyActions: CollegialBodyActions,
                private _meetingActions: MeetingActions,
                private  _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {
        this._subscription = this._ngRedux.select(x => x.meetings.filter)
            .subscribe(filter => {
                this.filter = filter;
            });

        this._ngRedux.dispatch(this._collegialBodyActions.updateCollegialBodies());
        this._ngRedux.dispatch(this._meetingActions.updateMeetingsFilter(this.filter));
    }

    ngOnDestroy() {
        this._subscription.unsubscribe();
    }

    selectCollegialBody(body: ICollegialBody) {
        this.filter.collegialBody = body;
        this.onFilterChange();
    }

    refresh() {
        this.onFilterChange();
    }

    clearFilters() {
        this.filter = {};
        this.onFilterChange();
    }

    onFilterChange() {
        this._ngRedux.dispatch(this._meetingActions.updateMeetingsFilter(this.filter));
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }
}
