import {NgRedux} from '@angular-redux/store';
import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {IDecision, IDecisionRef} from '@app/store/decision/decision.model';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {IMaterialRef} from '@app/store/material';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IMaterialVersion, IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {MaterialType} from '@app/store/material/material-type.model';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {IAppState} from '@app/store/store';
import {VoteActions} from '@app/store/vote/vote.actions';
import {IVote} from '@app/store/vote/vote.model';
import {VotingActions} from '@app/store/voting/voting.actions';
import {IVoting, IVotingRef} from '@app/store/voting/voting.model';
import {Observable} from 'rxjs/Observable';

@Component({
    selector: 'senat-agenda-item-projects',
    templateUrl: './agenda-item-projects.component.html',
    styleUrls: ['./agenda-item-projects.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemProjectsComponent implements OnInit {

    @Input()
    agendaItem: IAgendaItemRef;

    /**
     * Развёрнутый проект (версии).
     */
    projectExpanded: IMaterialRef;

    /**
     * Развёрнутое голосование.
     */
    votingExpanded: IVotingRef;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Проекты данного вопроса.
     */
    projects$: Observable<Array<{
        currentVersion: {
            self: IMaterialVersion,
            createdBy: IPerson
        },
        voting: IVoting,
        decision: IDecision
    }>>;

    canEdit$: Observable<boolean>;
    //noinspection JSUnusedGlobalSymbols
    /**
     * Голоса по текущему проекту.
     * get() здесь необходим, т.к. this.votingExpanded может меняться.
     */
    get votes$(): Observable<Array<{ self: IVote, createdBy: IPerson, owner: IPerson }>> {
        return this._ngRedux.select(x => this.votingExpanded
            ? x.votes.filter(v => v.voting.id === this.votingExpanded.id)
                .map(v => {
                    return {
                        self: v,
                        createdBy: x.persons.find(p => p.id === v.createdBy.id),
                        owner: x.persons.find(p => p.id === v.owner.id)
                    };
                })
            : []);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Версии текущего материала с голосованиями по ним (если есть).
     * get() здесь необходим, т.к. this.projectExpanded может меняться.
     */
    get versions$(): Observable<Array<{ self: IMaterialVersion, createdBy: IPerson, voting: IVoting }>> {
        return this._ngRedux.select(x =>
            this.projectExpanded
                ? x.materialVersions
                .filter(v => v.id === this.projectExpanded.id)
                .map(v => {
                    return {
                        self: v,
                        createdBy: x.persons.find(p => p.id === v.createdBy.id),
                        voting: x.votings.find(voting =>
                        voting.meeting.id === this.agendaItem.meeting.id &&
                        voting.subject.id === v.id &&
                        voting.subject.num === v.num)
                    };
                })
                .sort((one, two) => { // сортировка в обратном порядке
                    if (one.self.num > two.self.num) {
                        return -1;
                    }
                    if (one.self.num < two.self.num) {
                        return 1;
                    }
                    return 0;
                })
                : []);
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущий участник заседания.
     */
    get currentPerson$(): Observable<IPerson> {
        return this._ngRedux.select(x => {
            return x.persons.find(p => !!x.currentUser && p.id === x.currentUser.id);
        });
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Список участников заседания (для ручного ввода голосов).
     */
    participants$: Observable<Array<{ self: IMeetingParticipant, person: IPerson, alternates: Array<IPerson> }>> =
        this._ngRedux.select(x => x.meetingParticipants
            .filter(p => p.meeting.id === this.agendaItem.meeting.id)
            .map(p => {
                return {
                    self: p,
                    person: x.persons.find(pp => pp.id === p.person.id),
                    alternates: p.alternates.map(a => x.persons.find(person => person.id === a.id))
                };
            }));

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _issueMaterialActions: IssueMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _meetingParticipantActions: MeetingParticipantActions,
                private _voteActions: VoteActions,
                private _votingActions: VotingActions,
                private _decisionActions: DecisionActions,
                private _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {

        this.canEdit$ = this.hasPermission$(PermissionEnum.EditMeeting);
        this._ngRedux.dispatch(this._issueMaterialActions.loadDecisionProjects(this.agendaItem.issue));
        this._ngRedux.dispatch(this._votingActions.loadAgendaItemVotings(this.agendaItem));
        // для ролевой модели голосовалки
        // теперь загружается в agendaItem
        // this._ngRedux.dispatch(this._meetingParticipantActions.loadMeetingParticipants(this.agendaItem.meeting));

        this.projects$
            = this._ngRedux.select(x => x.issueMaterials
            .filter(m => m.issue.id === this.agendaItem.issue.id && m.type === MaterialType.DecisionProject)
            .map(m => {
                const currentVersion = x.materialVersions.find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);
                return {
                    currentVersion: {
                        self: currentVersion,
                        createdBy: x.persons.find(p => p.id === currentVersion.createdBy.id)
                    },
                    voting: x.votings.find(v => {
                        return v.meeting.id === this.agendaItem.meeting.id &&
                            v.subject.id === m.currentVersion.id &&
                            v.subject.num === m.currentVersion.num;
                    }),
                    decision: x.decisions.find(d => d.materialVersion.id === m.currentVersion.id &&
                        d.materialVersion.num === m.currentVersion.num &&
                        d.meeting.id === this.agendaItem.meeting.id
                    )
                };
            })
            .sort((one, two) => {
                if (one.currentVersion.self.fileName > two.currentVersion.self.fileName) {
                    return 1;
                }
                if (one.currentVersion.self.fileName < two.currentVersion.self.fileName) {
                    return -1;
                }
                return 0;
            }));

    }

    /**
     * Разворачивает и сворачивает версии, при необходимости инициирует загрузку.
     * @param material
     */
    toggleVersions(material: IMaterialRef) {
        if (this.projectExpanded && this.projectExpanded.id === material.id) {
            this.projectExpanded = null;
            return;
        }

        this.projectExpanded = material;
        // загружаем версии материала только при условии, что текущая версия > 1
        // и среди загруженных версий материала присутствует только одна (последняя) версия
        if (this._ngRedux.getState().materialVersions.filter(v => v.id === material.id).length === 1) {
            this._ngRedux.dispatch(this._materialVersionActions.loadMaterialVersions(material));
        }
    }

    /**
     * Создаёт голсоование за проект решения (конкретную его версию).
     * @param project
     */
    createVoting(project: IMaterialVersionRef) {
        this._ngRedux.dispatch(this._votingActions.createVoting(this.agendaItem.meeting, project));
    }

    /**
     * Завершает голосование.
     * @param voting
     */
    closeVoting(voting: IVotingRef) {
        this._ngRedux.dispatch(this._votingActions.closeVoting(voting));
    }

    toggleVotes(voting: IVotingRef) {
        if (this.votingExpanded && this.votingExpanded.id === voting.id) {
            this.votingExpanded = null;
            return;
        }

        this.votingExpanded = voting;
        this._ngRedux.dispatch(this._voteActions.loadVotes(voting));
    }

    createVote(vote: IVote) {
        this._ngRedux.dispatch(this._voteActions.createVote(vote));
    }

    createDecision(materialVersion: IMaterialVersionRef, accepted: boolean) {
        this._ngRedux.dispatch(this._decisionActions.createDecision({
            meeting: {
                id: this.agendaItem.meeting.id
            },
            materialVersion: {
                id: materialVersion.id,
                num: materialVersion.num
            },
            accepted: accepted
        }));
    }

    sendDecisionToApproval(decision: IDecisionRef, person: IPersonRef) {
        this._ngRedux.dispatch(this._decisionActions.sendDecisionToApproval(decision, person));
    }

    approveDecision(decision: IDecisionRef) {
        this._ngRedux.dispatch(this._decisionActions.approveDecision(decision));
    }

    canApprove$(decision: IDecision) {
        return this._ngRedux.select(x => x.currentUser &&
        decision &&
        decision.approval &&
        decision.approval.approvingPerson &&
        x.currentUser.id === decision.approval.approvingPerson.id);
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.meetingHasPermision(permission, this.agendaItem.meeting));
    }
}
