import {NgRedux} from '@angular-redux/store';
import {IAgendaItem, IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {IDecision, IDecisionRef} from '@app/store/decision/decision.model';
import {IMaterialRef} from '@app/store/material';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IMaterialVersion, IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IssueMaterialType} from '@app/store/material/material-type.model';
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
import {AgendaItemMaterialActions} from '@app/store/agenda-item-material/agenda-item-material.actions';
import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
import 'rxjs/add/operator/publishReplay';
@Component({
    selector: 'senat-agenda-item-projects',
    templateUrl: './agenda-item-projects.component.html',
    styleUrls: ['./agenda-item-projects.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AgendaItemProjectsComponent implements OnInit, OnDestroy {

    @Input()
    canChangeState: boolean;

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

    votingExpanded$ = new Subject<IVotingRef>();

    projectExpanded$ = new Subject<IMaterialRef>();

// agendaItem$ загружается из родительского компонента
    agendaItem$: Observable<IAgendaItem> = this._ngRedux.select(x => x.agendaItems)
        .map(ai => ai.find(
            x => !!x.id &&
            x.issue.id === this.agendaItem.issue.id &&
            x.meeting.id === this.agendaItem.meeting.id))
        .filter(f => !!f);


    agendaItemStatus$ = this.agendaItem$.map(x => x.status);

    canEdit$: Observable<boolean>;
    //noinspection JSUnusedGlobalSymbols
    /**
     * Голоса по текущему проекту.
     */
    votes$: Observable<Array<{ self: IVote, createdBy: IPerson, owner: IPerson }>> = Observable.combineLatest(
        this.votingExpanded$,
        this._ngRedux.select(x => x.votes),
        this._ngRedux.select(x => x.persons),
        (ve, xv, xp) => {
            if (!ve) {
                return [];
            }
            return xv.filter(v => v.voting.id === ve.id)
                .map(v => {
                    return {
                        self: v,
                        createdBy: xp.find(p => p.id === v.createdBy.id),
                        owner: xp.find(p => p.id === v.owner.id)
                    };
                })
        });


    //noinspection JSUnusedGlobalSymbols
    /**
     * Версии текущего материала с голосованиями по ним (если есть).
     */
    versions$: Observable<Array<{ self: IMaterialVersion, createdBy: IPerson, voting: IVoting }>> = Observable.combineLatest(
        this.projectExpanded$,
        this.agendaItem$,
        this._ngRedux.select(x => x.materialVersions),
        this._ngRedux.select(x => x.votings),
        this._ngRedux.select(x => x.persons),
        (ve, ai, xmv, xv, xp) => {
            if (!ve || !ai) {
                return [];
            }
            return xmv.filter(v => v.id === ve.id)
                .map(v => {
                    return {
                        self: v,
                        createdBy: xp.find(p => p.id === v.createdBy.id),
                        voting: xv.find(voting =>
                        voting.meeting.id === ai.meeting.id &&
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
                });

        })
        .filter(f => !!f && f.length > 0)
        .publishReplay(1)
        .refCount();


    //noinspection JSUnusedGlobalSymbols
    /**
     * Текущий участник заседания.
     */
    currentPerson$: Observable<IPerson> = Observable.combineLatest(
        this._ngRedux.select(x => x.persons),
        this._ngRedux.select(x => x.currentUser),
        (xp, xcu) => xp.find(p => !!xcu && p.id === xcu.id));


    //noinspection JSUnusedGlobalSymbols
    /**
     * Список участников заседания (для ручного ввода голосов).
     */
    participants$: Observable<Array<{ self: IMeetingParticipant, person: IPerson, alternates: Array<IPerson> }>> = Observable.combineLatest(
        this.agendaItem$,
        this._ngRedux.select(x => x.meetingParticipants),
        this._ngRedux.select(x => x.persons),
        (ai, xmp, xp) =>
            xmp.filter(p => p.meeting.id === ai.meeting.id)
                .map(p => {
                    return {
                        self: p,
                        person: xp.find(pp => pp.id === p.person.id),
                        alternates: p.alternates.map(a => xp.find(person => person.id === a.id))
                    };
                }));


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
    }>> = Observable.combineLatest(
        this.agendaItem$,
        this._ngRedux.select(x => x.agendaItemMaterials),
        this._ngRedux.select(x => x.materialVersions),
        this._ngRedux.select(x => x.votings),
        this._ngRedux.select(x => x.decisions),
        this._ngRedux.select(x => x.persons),
        (xai, xaim, xmv, xv, xd, xp) => {
            if (!xai || !xaim || !xmv) {
                return [];
            }
            const res = xaim.filter(x => xai && x.agendaItem.id === xai.id && x.type === IssueMaterialType.DecisionProject)
                .map(m => {
                    const currentVersion = xmv
                        .find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);
                    return {
                        currentVersion: {
                            self: currentVersion,
                            createdBy: xp.find(p => p.id === currentVersion.createdBy.id)
                        },
                        voting: xv.find(v => {
                            return v.meeting.id === this.agendaItem.meeting.id &&
                                v.subject.id === m.currentVersion.id &&
                                v.subject.num === m.currentVersion.num;
                        }),
                        decision: xd.find(d => d.materialVersion.id === m.currentVersion.id &&
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
                });
            return res;
        });

    private _subscriptions: Subscription[];

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _agendaMaterialActions: AgendaItemMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _voteActions: VoteActions,
                private _votingActions: VotingActions,
                private _decisionActions: DecisionActions,
                private _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {

        this.canEdit$ = this.hasPermission$(PermissionEnum.EditMeeting);

        this._subscriptions = [
            this.agendaItem$.subscribe(agendaItem => {
                this._ngRedux.dispatch(this._agendaMaterialActions.loadDecisionProjects(
                    agendaItem,
                    this.agendaItem.issue,
                    this.agendaItem.meeting));
            })];


        this._ngRedux.dispatch(this._votingActions.loadAgendaItemVotings(this.agendaItem));

    }

    ngOnDestroy() {
        this._subscriptions.forEach(x => x.unsubscribe());
    }

    /**
     * Разворачивает и сворачивает версии, при необходимости инициирует загрузку.
     * @param material
     */
    toggleVersions(material: IMaterialRef) {
        if (this.projectExpanded && this.projectExpanded.id === material.id) {
            this.projectExpanded = null;
            this.projectExpanded$.next(null);
            return;
        }

        this.projectExpanded = material;
        this.projectExpanded$.next(material);
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
            this.votingExpanded$.next(null);
            return;
        }

        this.votingExpanded = voting;
        this._ngRedux.dispatch(this._voteActions.loadVotes(voting));
        this.votingExpanded$.next(voting);
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
