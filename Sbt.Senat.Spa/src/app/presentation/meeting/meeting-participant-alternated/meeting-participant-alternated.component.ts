import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IPerson} from '@app/store/person/person.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';

@Component({
    selector: 'senat-meeting-participant-alternated',
    templateUrl: './meeting-participant-alternated.component.html',
    styleUrls: ['./meeting-participant-alternated.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MeetingParticipantAlternatedComponent implements OnInit {

    @Input()
    participant: {
        self: IMeetingParticipant,
        person: IPerson,
        alternates: Array<IPerson>
    };

    ngOnInit() {
    }
}
