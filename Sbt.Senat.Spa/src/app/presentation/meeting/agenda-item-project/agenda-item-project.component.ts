import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {IDecision} from '@app/store/decision/decision.model';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {MeetingParticipantRole} from '@app/store/meeting-participant/meeting-participant-role.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {VoteType} from '@app/store/vote/vote-type.model';
import {IVote} from '@app/store/vote/vote.model';
import {IVoting, IVotingRef} from '@app/store/voting/voting.model';
import {PopupComponent} from '@app/presentation/ui-kit/popup/popup.component';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {AgendaItemStatus} from '@app/store/agenda-item/agenda-item-status.model';
import {findPersonsByQuery} from '@app/store/person/person.selectors';

@Component({
    selector: 'senat-agenda-item-project',
    templateUrl: './agenda-item-project.component.html',
    styleUrls: ['./agenda-item-project.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemProjectComponent implements OnInit {

    buttonType = ButtonType;

    /**
     * Проект решения.
     */
    @Input()
    project: {
        currentVersion: { // его текущая версия
            self: IMaterialVersion,
            createdBy: IPerson
        },
        decision: IDecision, // решение по проекту
        voting: IVoting // голосование по проекту
    };

    /**
     * Версии проекта решения.
     */
    @Input()
    versions: Array<{
        self: IMaterialVersion,
        createdBy: IPerson,
        voting: IVoting // голосование за версию проекта решения
    }>;

    /**
     * Голоса.
     */
    @Input()
    votes: Array<{
        self: IVote,
        createdBy: IPerson,
        owner: IPerson
    }>;

    /**
     * Показывать прежние версии проекта решения.
     * Будут показаны именно предыдущие версии, без текущей, чтобы не дублировать голосование.
     */
    @Input()
    showVersions: boolean;

    /**
     * Показывать голоса конкретного голосования.
     */
    @Input()
    showVotesOf: IVotingRef;

    @Input()
    currentPerson: IPersonRef;

    @Input()
    participants: Array<{ self: IMeetingParticipant, person: IPerson, alternates: Array<IPerson> }> = [];

    @Input()
    canChangeState: boolean;

    @Input()
    canApprove: boolean;

    @Input()
    agendaItemStatus: AgendaItemStatus;

    @Output()
    toggleVersions = new EventEmitter();

    @Output()
    toggleVotes = new EventEmitter<IVoting>();

    @Output()
    createVoting = new EventEmitter();

    @Output()
    closeVoting = new EventEmitter();

    @Output()
    createVote = new EventEmitter<IVote>();

    @Output()
    createDecision = new EventEmitter<boolean>();

    @Output()
    selectApprover = new EventEmitter<IPerson>();
    @Output()
    approveDecision = new EventEmitter<void>();


    @ViewChild('approverPopup') approverPopup: PopupComponent;

    newVote: IVote;


    private approverQuery = '';

    get participantPersons(): Array<IPerson> {
        if (!this.participants) {
            return [];
        }
        return findPersonsByQuery(this.participants
            .map(p => p.person), this.approverQuery);
    }

    /**
     * Может управлять голосованием (создавать/завершать).
     */
    get votingManagementAllowed(): boolean {
        if (!this.currentPerson) {
            return false;
        }

        if (this.agendaItemStatus === AgendaItemStatus.Resolved) {
            return false;
        }

        const currentParticipant = this.findParticipant(this.participants, this.currentPerson);

        return (currentParticipant && currentParticipant.self.roles // если текущий участник - секретарь
                .some(x => x === MeetingParticipantRole.Secretary)) || this.participants
                .some(p => p.self.roles // или текущий участник - зам секретаря
                    .some(x => x === MeetingParticipantRole.Secretary) && p.self.alternates
                    .some(a => a.id === this.currentPerson.id))
    }

    /**
     * Может голосовать.
     */
    get voteAllowed(): boolean {
        if (!this.currentPerson) {
            return false;
        }

        const currentParticipant = this.findParticipant(this.participants, this.currentPerson);

        return (currentParticipant && currentParticipant.self.roles
                .some(x => x === MeetingParticipantRole.Head || // текущий участник обладает правом голоса
                    x === MeetingParticipantRole.Secretary ||
                    x === MeetingParticipantRole.RegularMember
                )) || this.participants
                .some(p => p.self.roles // или текущий участник - зам участника с правом голоса
                    .some(x => x === MeetingParticipantRole.Head ||
                        x === MeetingParticipantRole.Secretary ||
                        x === MeetingParticipantRole.RegularMember
                    ) && p.self.alternates
                    .some(a => a.id === this.currentPerson.id));
    }

    /**
     * Обладает правом вето.
     */
    get vetoAllowed(): boolean {
        if (!this.currentPerson) {
            return false;
        }

        const currentParticipant = this.findParticipant(this.participants, this.currentPerson);

        return (currentParticipant && currentParticipant.self.roles
                .some(x => x === MeetingParticipantRole.Head || // текущий участник - председатель или секретарь
                    x === MeetingParticipantRole.Secretary
                )) || this.participants // или текущий участник - зам участника, являющегося председателем или секретарём
                .some(p => p.self.roles
                    .some(x => x === MeetingParticipantRole.Head ||
                        x === MeetingParticipantRole.Secretary
                    ) && p.self.alternates
                    .some(a => a.id === this.currentPerson.id));
    }

    /**
     * Текущий пользователь - секретарь.
     */
    get isSecretary(): boolean {
        if (!this.currentPerson) {
            return false;
        }

        const currentParticipant = this.findParticipant(this.participants, this.currentPerson);

        if (!currentParticipant) {
            return false;
        }

        return currentParticipant.self.roles // текущий участник - секретарь
                .some(x => x === MeetingParticipantRole.Secretary) || this.participants
                .some(p => p.self.roles // или текущий участник - зам секретаря
                    .some(x => x === MeetingParticipantRole.Secretary) && p.self.alternates
                    .some(a => a.id === currentParticipant.self.person.id));
    }

    /**
     * Участники, от имени которых можно вносить голос (для ручного ввода секретарём).
     */
    get voteOwnerSuggestions(): Array<IPerson> {
        let participants: Array<{ self: IMeetingParticipant, person: IPerson, alternates: Array<IPerson> }>;

        if (this.newVote.type === VoteType.Veto) {
            participants = this.participants
                .filter(x => x.self.roles
                    .some(r => r === MeetingParticipantRole.Head)); // вето обладает только председатель

        } else {
            participants = this.participants
                .filter(x => x.self.roles
                    .some(r => r === MeetingParticipantRole.Head || // правом голоса обладают председатель и регулярные участники
                        r === MeetingParticipantRole.RegularMember
                    ));
        }

        return participants.reduce((all, current) => {
            for (const person of current.alternates.concat(current.person)) {  // сами участники и их заместители
                if (!all.some(p => p.id === person.id)) {
                    all.push(person);
                }
            }
            return all;
        }, []);
    }

    constructor() {
    }

    ngOnInit() {
    }

    toggleVote(type: VoteType) {
        if (this.newVote && this.newVote.type === type) {
            this.newVote = null;
            return;
        }

        this.newVote = {
            voting: {
                id: this.project.voting.id
            },
            type: type,
            createdAt: null,
            specialOpinion: this.newVote ? this.newVote.specialOpinion : '',
            createdBy: null,
            owner: null
        };
    }

    /**
     * Отмена внесения голоса.
     */
    discardVote() {
        this.newVote = null;
    }

    approverQueryChanged(query: string) {
        this.approverQuery = query;
    }

    /**
     * Выбор обладателя голоса (ручной ввод голосов).
     * @param person
     */
    selectVoteOwner(person: IPerson) {
        this.newVote.owner = person;
    }

    selectApproverPerson(person: IPerson) {
        if (person) {
            this.selectApprover.emit(person);
            this.approverPopup.hide();
        }
    }

    private findParticipant(participants: Array<{ self: IMeetingParticipant, person: IPerson, alternates: Array<IPerson> }>,
                            person: IPersonRef): { self: IMeetingParticipant, person: IPerson, alternates: Array<IPerson> } {

        return participants.find(p => p.self.person.id === person.id);
    }
}
