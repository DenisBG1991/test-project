import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {AgendaItemParticipantRole} from '@app/store/agenda-item-participants/agenda-item-participant-role.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';

@Component({
    selector: 'senat-agenda-item-participants',
    templateUrl: './agenda-item-participants.component.html',
    styleUrls: ['./agenda-item-participants.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemParticipantsComponent implements OnInit {

    /**
     * editable = false для всех групп
     * @type {boolean}
     */
    @Input()
    readOnly: false;

    /**
     * Участники вопроса.
     */
    @Input()
    participants: Array<{ self: IAgendaItemParticipant, person: IPerson }> = [];

    /**
     * Список предложенных вариантов для селектов людей.
     * @type {Array}
     */
    @Input()
    suggestions: Array<IPerson> = [];

    @Input()
    meetingParticipants: Array<IMeetingParticipant>;

    @Input()
    persons: Array<IPerson>;

    /**
     * Изменение поисковой строки (в селекторе людей).
     * @type {EventEmitter}
     */
    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter();

    /**
     * Отметка присутствия.
     */
    @Output()
    checkIn: EventEmitter<IPerson> = new EventEmitter();

    /**
     * Отметка отсутствия.
     */
    @Output()
    checkOut: EventEmitter<IPerson> = new EventEmitter();

    /**
     * Добавление участника.
     */
    @Output()
    addParticipant: EventEmitter<{ person: IPerson, role: AgendaItemParticipantRole }> = new EventEmitter();

    /**
     * Исключение участника.
     * @type {EventEmitter}
     */
    @Output()
    removeParticipant: EventEmitter<{ person: IPerson, role: AgendaItemParticipantRole }> = new EventEmitter();

    /**
     * Группы участников для отображения.
     * Не является частью state'а приложения, это скорее константа.
     * Группы участников, приглашённых на вопрос и на заседание хотели объединить в одну группу "приглашённе",
     * но в этом случае появляются неоднозначности с добавлением/исключением участника из группы.
     */
    groups: Array<{ role: AgendaItemParticipantRole, editable: boolean }> = [
        {
            role: AgendaItemParticipantRole.CollegialBodyMember,
            editable: false
        },
        {
            role: AgendaItemParticipantRole.InvitedOnMeeting,
            editable: false
        },
        {
            role: AgendaItemParticipantRole.Speaker,
            editable: true
        },
        {
            role: AgendaItemParticipantRole.InvitedOnIssue,
            editable: true
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

    onCheckIn(person: IPerson) {
        if (!this.readOnly) {
            this.checkIn.emit(person);
        }
    }

    onCheckOut(person: IPerson) {
        if (!this.readOnly) {
            this.checkOut.emit(person);
        }
    }


    findParticipant(person: IPerson): { self: IAgendaItemParticipant, person: IPerson } {
        return this.participants.find(f => f.self.person.id === person.id);
    }
}
