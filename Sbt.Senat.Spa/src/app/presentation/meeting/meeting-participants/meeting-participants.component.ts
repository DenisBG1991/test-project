import {Component, OnInit, ChangeDetectionStrategy, Input} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Observable} from 'rxjs/Observable';
import {IMeeting} from '@app/store/meeting/meeting.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {IPerson} from '@app/store/person/person.model';
import {MeetingParticipantRole} from '@app/store/meeting-participant/meeting-participant-role.model';
import {PersonActions} from '@app/store/person/person.actions';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {PermissionEnum} from '@app/store/permission';
import {findPersonsByQuery} from '@app/store/person/person.selectors';
import {MeetingStatus} from '@app/store/meeting/meeting-status';

@Component({
    selector: 'senat-meeting-participants',
    templateUrl: './meeting-participants.component.html',
    styleUrls: ['./meeting-participants.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingParticipantsComponent implements OnInit {

    meetingStatus = MeetingStatus;

    @Input()
    meeting: IMeetingRef;

    query = '';

    canEdit$: Observable<boolean>;

    //noinspection JSUnusedGlobalSymbols
    meetingDetails$: Observable<IMeeting> = this._ngRedux.select(x => x.meetings.items)
        .map(mi => mi.find(m => m.id === this.meeting.id));

    //noinspection JSUnusedGlobalSymbols
    collegialBodyMembers$: Observable<Array<{
        self: IMeetingParticipant,
        person: IPerson,
        alternates: Array<IPerson>
    }>> = Observable.combineLatest(
        this._ngRedux.select(x => x.meetingParticipants),
        this._ngRedux.select(x => x.persons),
        (xmp, xp) =>
            xmp.filter(p => p.meeting.id === this.meeting.id && p.roles
                .find(r => [MeetingParticipantRole.Head, MeetingParticipantRole.Secretary, MeetingParticipantRole.RegularMember]
                    .find(rr => rr === r) != null) != null)
                .map(p => {
                    return {
                        self: p,
                        person: xp.find(person => person.id === p.person.id),
                        alternates: xp.filter(person => p.alternates.find(pp => pp.id === person.id) != null)
                            .sort((one, two) => {
                                const fullNameOne = `${one.lastName} ${one.firstName} ${one.middleName}`;
                                const fullNameTwo = `${two.lastName} ${two.firstName} ${two.middleName}`;

                                if (fullNameOne > fullNameTwo) {
                                    return 1;
                                }
                                if (fullNameOne < fullNameTwo) {
                                    return -1;
                                }
                                return 0;
                            })
                    };
                })
                .sort((one, two) => {
                    const fullNameOne = `${one.person.lastName} ${one.person.firstName} ${one.person.middleName}`;
                    const fullNameTwo = `${two.person.lastName} ${two.person.firstName} ${two.person.middleName}`;

                    if (fullNameOne > fullNameTwo) {
                        return 1;
                    }
                    if (fullNameOne < fullNameTwo) {
                        return -1;
                    }
                    return 0;
                })
    );


    //noinspection JSUnusedGlobalSymbols
    invitedPersons$: Observable<Array<IPerson>> = Observable.combineLatest(
        this._ngRedux.select(x => x.meetingParticipants),
        this._ngRedux.select(x => x.persons),
        (xmp, xp) =>
            xmp.filter(p => p.meeting.id === this.meeting.id && p.roles
                .find(r => [MeetingParticipantRole.InvitedPerson].find(rr => rr === r) != null) != null)
                .map(p => xp.find(person => person.id === p.person.id))
                .sort((one, two) => {
                    const fullNameOne = `${one.lastName} ${one.firstName} ${one.middleName}`;
                    const fullNameTwo = `${two.lastName} ${two.firstName} ${two.middleName}`;

                    if (fullNameOne > fullNameTwo) {
                        return 1;
                    }
                    if (fullNameOne < fullNameTwo) {
                        return -1;
                    }
                    return 0;
                }));


    //noinspection JSUnusedGlobalSymbols
    suggestions$: Observable<Array<IPerson>> =
        this._ngRedux.select(x => x.persons)
            .map(x => findPersonsByQuery(x, this.query))
            .filter(f => !!f);


    constructor(private _ngRedux: NgRedux<IAppState>,
                private _personActions: PersonActions,
                private _meetingParticipantActions: MeetingParticipantActions,
                private _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {
        this.canEdit$ = this.hasPermission$(PermissionEnum.EditMeeting);
    }

    findPeople(query: string) {
        this.query = query;
        this._ngRedux.dispatch(this._personActions.loadPersons(this.query));
    }

    addInvitedPerson(person: IPerson) {
        this._ngRedux.dispatch(this._meetingParticipantActions.addInvitedPerson(this.meeting, person));
    }

    removeInvitedPerson(person: IPerson) {
        this._ngRedux.dispatch(this._meetingParticipantActions.removeInvitedPerson(this.meeting, person));
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.meetingHasPermision(permission, this.meeting));
    }
}
