import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IAgendaItemParticipant, IParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {IPerson, IPersonRef} from '@app/store/person/person.model';

@Component({
    selector: 'senat-agenda-item-attendee',
    templateUrl: './agenda-item-attendee.component.html',
    styleUrls: ['./agenda-item-attendee.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemAttendeeComponent implements OnInit {

    /**
     * Участник вопроса.
     */
    @Input()
    participant: { self: IAgendaItemParticipant, alternateParticipants: Array<IParticipant>, person: IPerson, alternates: Array<IPerson> };

    @Input()
    attendeePreviousPresentsState: boolean;

    @Input()
    showRemoveBtn = true;

    @Input()
    disabled = false;
    /**
     * Отметка присутствия.
     */
    @Output()
    checkIn: EventEmitter<IAgendaItemParticipant> = new EventEmitter();

    /**
     * Отметка отсутствия.
     */
    @Output()
    checkOut: EventEmitter<IAgendaItemParticipant> = new EventEmitter();

    /**
     * Отметка присутствия зама
     */
    @Output()
    checkAlternateIn: EventEmitter<IAgendaItemParticipant> = new EventEmitter();

    /**
     * Отметка отсутствия зама
     */
    @Output()
    checkAlternateOut: EventEmitter<IAgendaItemParticipant> = new EventEmitter();

    /**
     * Удаление.
     */
    @Output()
    remove: EventEmitter<any> = new EventEmitter();


    get firstAlternatePerson(): IPerson {
        if (this.firstAlternate) {
            return this.participant.alternates.find(f => f.id === this.firstAlternate.person.id)
        }
    }

    get firstAlternate(): IParticipant {
        if (this.participant.alternateParticipants
            && this.participant.alternateParticipants.length > 0) {
            return this.participant.alternateParticipants[0];
        }
        return null;
    }

    get isFirstAlternateSelected(): boolean {
        return this.firstAlternate ? this.firstAlternate.presents : false;
    }

    ngOnInit() {
    }

    toggleSelect() {
        if (this.disabled) {
            return;
        }
        this.participant.self.presents ? this.checkOut.emit(this.participant.self) : this.checkIn.emit(this.participant.self);
    }

    toggleAlternateSelect() {
        if (this.disabled) {
            return;
        }
        if (!this.firstAlternate) {
            return;
        }
        const alternate: IAgendaItemParticipant = {
            agendaItem: this.participant.self.agendaItem,
            roles: this.participant.self.roles,
            person: this.firstAlternate.person,
            presents: true
        }
        this.isFirstAlternateSelected ? this.checkOut.emit(alternate) : this.checkIn.emit(alternate);
    }

    get isAlternateBig(): boolean {
        return (this.participant && !this.participant.self.presents && this.isFirstAlternateSelected);
    }
}
