import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import {IMeeting} from '@app/store/meeting/meeting.model';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {Router} from '@angular/router';

@Component({
    selector: 'senat-meetings-list',
    templateUrl: './meetings-list.component.html',
    styleUrls: ['./meetings-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingsListComponent implements OnInit {

    meetings$: Observable<Array<IMeeting>> =
        this._ngRedux.select(x => x.meetings.items);

    canFetchMore: Observable<boolean> =
        this._ngRedux.select(x => x.meetings.paging.total > x.meetings.items.length);

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _actions: MeetingActions,
                private _router: Router) {
    }

    ngOnInit() {
    }

    fetchMore() {
        this._ngRedux.dispatch(this._actions.fetchMoreMeetings());
    }

    navigateToMeeting(meetingId: number) {
        this._router.navigate([`/meetings/${meetingId}`]);
    }
}
