import {NgModule} from '@angular/core';
import {DevToolsExtension, NgRedux} from '@angular-redux/store';
import {NgReduxRouter} from '@angular-redux/router';
import {createLogger} from 'redux-logger';
import {createEpicMiddleware} from 'redux-observable';
import {IAppState, INITIAL_STATE, rootReducer} from '@app/store/store';
import {AgendaActions} from '@app/store/agenda/agenda.actions';
import {AgendaEpics} from '@app/store/agenda/agenda.epics';
import {AgendaItemActions} from '@app/store/agenda-item/agenda-item.actions';
import {AgendaItemEpics} from '@app/store/agenda-item/agenda-item.epics';
import {AgendaItemParticipantActions} from '@app/store/agenda-item-participants/agenda-item-participant.actions';
import {AgendaItemParticipantEpics} from '@app/store/agenda-item-participants/agenda-item-participant.epics';
import {CollegialBodyActions} from '@app/store/collegial-body/collegial-body.actions';
import {CollegialBodyEpics} from '@app/store/collegial-body/collegial-body.epic';
import {ControlsLayoutActions} from '@app/store/layout/layout.actions';
import {DecisionActions} from '@app/store/decision/decision.actions';
import {DecisionEpics} from '@app/store/decision/decision.epics';
import {ErrorActions} from '@app/store/error/error.actions';
import {ErrorEpics} from '@app/store/error/error.epics';
import {IssueActions} from '@app/store/issue';
import {IssueEpics} from '@app/store/issue/issue.epic';
import {IssueListEpics} from '@app/store/issue-list/issue-list.epic';
import {IssueListActions} from '@app/store/issue-list';
import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {MeetingEpics} from '@app/store/meeting/meeting.epic';
import {MeetingParticipantEpics} from '@app/store/meeting-participant/meeting-participant.epic';
import {MeetingParticipantActions} from '@app/store/meeting-participant/meeting-participant.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {PersonEpics} from '@app/store/person/person.epics';
import {SessionActions} from '@app/store/session/session.actions';
import {SessionEpics} from '@app/store/session/session.epics';
import {IssueMaterialFolderEpics} from '@app/store/issue-material-folder/issue-material-folder.epics';
import {IssueMaterialFolderActions} from '@app/store/issue-material-folder/issue-material-folder.actions';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IssueMaterialEpics} from '@app/store/issue-material/issue-material.epics';
import {MaterialVersionEpics} from '@app/store/material-version/material-version.epics';
import {VotingEpics} from '@app/store/voting/voting.epics';
import {VoteActions} from '@app/store/vote/vote.actions';
import {VotingActions} from '@app/store/voting/voting.actions';
import {VoteEpics} from '@app/store/vote/vote.epics';
import {IssueSharePersonEpics} from '@app/store/issue-share-person/issue-share-person.epics';
import {IssueSharePersonActions} from '@app/store/issue-share-person/issue-share-person.actions';
import {MeetingLayoutActions} from '@app/store/layout/meeting-layout.actions';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {PermissionEpics} from '@app/store/permission/permission.epic';
import {LabelEpics} from '@app/store/label/label.epic';
import {LabelActions} from '@app/store/label/label.actions';
import {RouterHistoryActions} from '@app/store/router/router-history.actions';
import {AgendaItemMaterialEpics} from '@app/store/agenda-item-material/agenda-item-material.epics';
import {AgendaItemMaterialActions} from '@app/store/agenda-item-material/agenda-item-material.actions';
import {AgendaItemMaterialFolderActions} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.actions';
import {AgendaItemMaterialFolderEpics} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.epics';
import {MeetingMaterialEpics} from '@app/store/meeting-material/meeting-material.epics';

@NgModule({
    exports: [
        // NgReduxModule,
        // NgReduxRouterModule
    ],
    providers: [ // да, по алфавиту. да, задротство. да, искать удобнее
        AgendaActions,
        AgendaEpics,
        AgendaItemActions,
        AgendaItemEpics,
        AgendaItemMaterialActions,
        AgendaItemMaterialEpics,
        AgendaItemMaterialFolderActions,
        AgendaItemMaterialFolderEpics,
        AgendaItemParticipantActions,
        AgendaItemParticipantEpics,
        CollegialBodyActions,
        CollegialBodyEpics,
        ControlsLayoutActions,
        DecisionActions,
        DecisionEpics,
        ErrorActions,
        ErrorEpics,
        LabelActions,
        LabelEpics,
        MeetingActions,
        MeetingLayoutActions,
        MeetingMaterialEpics,
        MaterialVersionActions,
        MaterialVersionEpics,
        MeetingEpics,
        MeetingParticipantActions,
        MeetingParticipantEpics,
        IssueActions,
        IssueEpics,
        IssueListActions,
        IssueListEpics,
        IssueMaterialActions,
        IssueMaterialEpics,
        IssueMaterialFolderActions,
        IssueMaterialFolderEpics,
        IssueSharePersonActions,
        IssueSharePersonEpics,
        PermissionActions,
        PermissionEpics,
        PersonActions,
        PersonEpics,
        RouterHistoryActions,
        SessionActions,
        SessionEpics,
        VoteActions,
        VoteEpics,
        VotingActions,
        VotingEpics
    ]
})
export class StoreModule {
    constructor(ngRedux: NgRedux<IAppState>,
                ngReduxRouter: NgReduxRouter,
                devTools: DevToolsExtension,
                private _agendaEpics: AgendaEpics,
                private _agendaItemEpics: AgendaItemEpics,
                private _agendaItemMaterialEpics: AgendaItemMaterialEpics,
                private _agendaItemMaterialFolderEpics: AgendaItemMaterialFolderEpics,
                private _agendaItemParticipantEpics: AgendaItemParticipantEpics,
                private _collegialBodyEpics: CollegialBodyEpics,
                private _decisionEpics: DecisionEpics,
                private _errorEpics: ErrorEpics,
                private _issueEpics: IssueEpics,
                private _issueListEpics: IssueListEpics,
                private _issueMaterialEpics: IssueMaterialEpics,
                private _issueMaterialFolderEpics: IssueMaterialFolderEpics,
                private _issueSharePersonEpics: IssueSharePersonEpics,
                private _labelEpics: LabelEpics,
                private _materialVersionEpics: MaterialVersionEpics,
                private _meetingEpics: MeetingEpics,
                private _meetingMaterialEpics: MeetingMaterialEpics,
                private _meetingParticipantEpics: MeetingParticipantEpics,
                private _permissionEpics: PermissionEpics,
                private _personEpics: PersonEpics,
                private _sessionEpics: SessionEpics,
                private _voteEpics: VoteEpics,
                private _votingEpics: VotingEpics) {

        const storeEnhancers = !devTools.isEnabled() ? [] : [devTools.enhancer()];

        const middleware = [
            createLogger(),
            createEpicMiddleware(this._agendaEpics.getAgenda),
            createEpicMiddleware(this._agendaItemEpics.loadSingleAgendaItem),
            createEpicMiddleware(this._agendaItemEpics.loadAgendaItemParticipants),
            createEpicMiddleware(this._agendaItemEpics.moveAgendaItem),
            createEpicMiddleware(this._agendaItemEpics.removeAgendaItem),
            createEpicMiddleware(this._agendaItemEpics.moveAgendaItemState),
            createEpicMiddleware(this._agendaItemEpics.createAgendaItems),
            createEpicMiddleware(this._agendaItemMaterialEpics.loadPresentations),
            createEpicMiddleware(this._agendaItemMaterialEpics.loadDecisionProjects),
            createEpicMiddleware(this._agendaItemMaterialEpics.changeMaterialType),
            createEpicMiddleware(this._agendaItemMaterialEpics.deleteMaterial),
            createEpicMiddleware(this._agendaItemMaterialEpics.uploadAgendaItemMaterial),
            createEpicMiddleware(this._agendaItemMaterialFolderEpics.loadFolder),
            createEpicMiddleware(this._agendaItemParticipantEpics.checkIn),
            createEpicMiddleware(this._agendaItemParticipantEpics.checkOut),
            createEpicMiddleware(this._agendaItemParticipantEpics.addParticipant),
            createEpicMiddleware(this._agendaItemParticipantEpics.removeParticipant),
            createEpicMiddleware(this._collegialBodyEpics.loadCollegialBodies),
            createEpicMiddleware(this._decisionEpics.approveDecision),
            createEpicMiddleware(this._decisionEpics.createDecision),
            createEpicMiddleware(this._decisionEpics.loadDecisions),
            createEpicMiddleware(this._decisionEpics.sendDecisionToApproval),
            createEpicMiddleware(this._errorEpics.handleError),
            createEpicMiddleware(this._issueEpics.createIssue),
            createEpicMiddleware(this._issueEpics.deleteIssue),
            createEpicMiddleware(this._issueEpics.loadIssue),
            createEpicMiddleware(this._issueEpics.updateIssue),
            createEpicMiddleware(this._issueEpics.moveIssueState),
            createEpicMiddleware(this._issueEpics.findIssues),
            createEpicMiddleware(this._issueListEpics.loadIssues),
            createEpicMiddleware(this._issueMaterialEpics.changeMaterialType),
            createEpicMiddleware(this._issueMaterialEpics.deleteMaterial),
            createEpicMiddleware(this._issueMaterialEpics.loadDecisionProjects),
            createEpicMiddleware(this._issueMaterialEpics.loadPresentations),
            createEpicMiddleware(this._issueMaterialEpics.uploadIssueMaterial),            
            createEpicMiddleware(this._issueMaterialFolderEpics.loadFolder),
            createEpicMiddleware(this._issueSharePersonEpics.loadSharePersons),
            createEpicMiddleware(this._issueSharePersonEpics.addSharePerson),
            createEpicMiddleware(this._issueSharePersonEpics.removeSharePerson),
            createEpicMiddleware(this._labelEpics.createLabel),
            createEpicMiddleware(this._labelEpics.loadLabels),
            createEpicMiddleware(this._materialVersionEpics.loadVersions),
            createEpicMiddleware(this._materialVersionEpics.uploadMaterialVersion),
            createEpicMiddleware(this._meetingEpics.reloadMeetings),
            createEpicMiddleware(this._meetingEpics.appendMeetings),
            createEpicMiddleware(this._meetingEpics.loadSingleMeeting),
            createEpicMiddleware(this._meetingEpics.createAbsentiaMeeting),
            createEpicMiddleware(this._meetingEpics.createPresentiaMeeting),
            createEpicMiddleware(this._meetingEpics.deleteMeeting),
            createEpicMiddleware(this._meetingEpics.moveMeetingState),
            createEpicMiddleware(this._meetingEpics.formMeetingProtocol),
            createEpicMiddleware(this._meetingEpics.editMeeting),
            createEpicMiddleware(this._meetingMaterialEpics.loadProtocol),
            createEpicMiddleware(this._meetingParticipantEpics.loadMeetingParticipants),
            createEpicMiddleware(this._meetingParticipantEpics.addInvitedPerson),
            createEpicMiddleware(this._meetingParticipantEpics.removeInvitedPerson),
            createEpicMiddleware(this._sessionEpics.login),
            createEpicMiddleware(this._sessionEpics.logout),
            createEpicMiddleware(this._sessionEpics.sessionExpired),
            createEpicMiddleware(this._permissionEpics.addIssuePermissions),
            createEpicMiddleware(this._permissionEpics.addMeetingPermissions),
            createEpicMiddleware(this._permissionEpics.loadGroupPermissions),
            createEpicMiddleware(this._personEpics.findPersons),
            createEpicMiddleware(this._voteEpics.createVote),
            createEpicMiddleware(this._voteEpics.loadVotes),
            createEpicMiddleware(this._votingEpics.loadVotings),
            createEpicMiddleware(this._votingEpics.createVoting),
            createEpicMiddleware(this._votingEpics.closeVoting)
        ];

        const initialState = INITIAL_STATE;
        initialState.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        ngRedux.configureStore(
            rootReducer,
            INITIAL_STATE,
            middleware,
            storeEnhancers);

        ngRedux.subscribe(() => {
            localStorage.setItem('currentUser', JSON.stringify(ngRedux.getState().currentUser));
        });

        ngReduxRouter.initialize();
    };
}
