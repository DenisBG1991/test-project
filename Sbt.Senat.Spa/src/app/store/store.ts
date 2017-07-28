import {combineReducers} from 'redux';
import {routerReducer} from '@app/store/router/router.reducer';

import * as permission from '@app/store/permission';
import * as issueList from '@app/store/issue-list';
import * as issue from '@app/store/issue';
import {meetingReducer} from '@app/store/meeting/meeting.reducer';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {collegialBodyReducer} from '@app/store/collegial-body/collegial-body.reducer';
import {IUser} from '@app/store/user/user.model';
import {sessionReducer} from '@app/store/session/session.reducer';
import {
    controlsLayoutInitialState, ILayoutState, loginLayoutInitialState,
    issueLayoutInitialState
} from '@app/store/layout/layout.types';
import {loginLayoutReducer, controlsLayoutReducer, issueLayoutReducer} from '@app/store/layout/layout.reducer';
import {IMeetingsState, meetingsInitialState} from '@app/store/meeting/meetings-state.model';
import {IAgenda} from '@app/store/agenda/agenda.model';
import {IMeetingParticipant} from '@app/store/meeting-participant/meeting-participant.model';
import {IPerson} from '@app/store/person/person.model';
import {personReducer} from '@app/store/person/person.reducer';
import {IAgendaItem} from '@app/store/agenda-item/agenda-item.model';
import {agendaReducer} from '@app/store/agenda/agenda.reducer';
import {agendaItemReducer} from '@app/store/agenda-item/agenda-item.reducer';
import {meetingParticipantReducer} from '@app/store/meeting-participant/meeting-participant.reducer';
import {IAgendaItemParticipant} from '@app/store/agenda-item-participants/agenda-item-participant.model';
import {agendaItemParticipantsReducer} from '@app/store/agenda-item-participants/agenda-item-participants.reducer';
import {createAbsentiaMeetingFormReducer} from '@app/store/layout/create-absentia-meeting-form.reducer';
import {createPresentiaMeetingFormReducer} from '@app/store/layout/create-presentia-meeting-form.reducer';
import {meetingAbsentiaFormReducer} from '@app/store/layout/meeting-absentia-form.reducer';
import {meetingPresentiaFormReducer} from '@app/store/layout/meeting-presentia-form.reducer';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {issueMaterialFolderReducer} from '@app/store/issue-material-folder/issue-material-folder.reducer';
import {issueMaterialReducer} from '@app/store/issue-material/issue-material.reducer';
import {materialVersionReducer} from '@app/store/material-version/material-version.reducer';
import {IVoting} from '@app/store/voting/voting.model';
import {IVote} from '@app/store/vote/vote.model';
import {votingReducer} from '@app/store/voting/voting.reducer';
import {voteReducer} from '@app/store/vote/vote.reducer';
import {IDecision} from '@app/store/decision/decision.model';
import {decisionReducer} from '@app/store/decision/decision.reducer';
import {IIssue} from '@app/store/issue';
import {issuesReducer} from '@app/store/issue/issues.reducer';
import {issueSharePersonReducer} from '@app/store/issue-share-person/issue-share-person.reducer';
import {IIssuePerson} from '@app/store/issue-share-person/issue-share-person.model';
import {meetingLayoutReducer} from '@app/store/layout/meeting-layout.reducer';
import {meetingLayoutInitialState} from '@app/store/layout/meeting-layout-state.model';
import {createIssueFormReducer} from '@app/store/layout/create-issue-form.reducer';
import {labelsReducer} from '@app/store/label/labels.reducer';
import {routerHistoryReducer} from '@app/store/router/router-history.reducer';
import {agendaItemLayoutReducer} from '@app/store/layout/agenda-item-layout.reducer';
import {agendaItemLayoutInitialState} from '@app/store/layout/agenda-item-layout-state.model';
import {ILabel} from '@app/store/label';

export interface IOperationState {
    updating: boolean;
    errorOccurred: boolean;
}

export interface IAppState {
    agenda: Array<IAgenda>;
    agendaItems: Array<IAgendaItem>;
    agendaItemParticipants: Array<IAgendaItemParticipant>;
    collegialBodies: Array<ICollegialBody>;
    currentUser: IUser;
    decisions: Array<IDecision>;
    issueList?: issueList.IIssueListState;
    issue?: issue.IIssueState;
    issueMaterialFolders: Array<IIssueMaterialFolder>;
    issueMaterials: Array<IIssueMaterial>;
    issues: Array<IIssue>;
    issueSharePersons: Array<IIssuePerson>;
    labels: Array<ILabel>;
    layout: ILayoutState;
    materialVersions: Array<IMaterialVersion>;
    meetings: IMeetingsState;
    meetingParticipants: Array<IMeetingParticipant>;
    permissions?: Array<permission.IPermission>;
    persons: Array<IPerson>;
    router: string;
    routerHistory: Array<string>;
    votes: Array<IVote>;
    votings: Array<IVoting>;
}

export const rootReducer = combineReducers<IAppState>({
    agenda: agendaReducer,
    agendaItems: agendaItemReducer,
    agendaItemParticipants: agendaItemParticipantsReducer,
    collegialBodies: collegialBodyReducer,
    currentUser: sessionReducer,
    decisions: decisionReducer,
    issueList: issueList.issueListReducer,
    issue: issue.issueReducer,
    issueMaterialFolders: issueMaterialFolderReducer,
    issueMaterials: issueMaterialReducer,
    issues: issuesReducer,
    issueSharePersons: issueSharePersonReducer,
    labels: labelsReducer,
    layout: combineReducers<ILayoutState>({
        login: loginLayoutReducer,
        issue: issueLayoutReducer,
        controls: controlsLayoutReducer,
        createPresentiaMeetingForm: createPresentiaMeetingFormReducer,
        createAbsentiaMeetingForm: createAbsentiaMeetingFormReducer,
        meetingPresentiaForm: meetingPresentiaFormReducer,
        meetingAbsentiaForm: meetingAbsentiaFormReducer,
        meeting: meetingLayoutReducer,
        createIssueForm: createIssueFormReducer,
        agendaItem: agendaItemLayoutReducer
    }),
    materialVersions: materialVersionReducer,
    meetings: meetingReducer,
    meetingParticipants: meetingParticipantReducer,
    permissions: permission.permissionReducer,
    persons: personReducer,
    router: routerReducer,
    routerHistory: routerHistoryReducer,
    votes: voteReducer,
    votings: votingReducer
});

export const INITIAL_STATE: IAppState = {
    agenda: [],
    agendaItems: [],
    agendaItemParticipants: [],
    collegialBodies: [],
    currentUser: null,
    decisions: [],
    issue: issue.INITIAL_STATE,
    issueList: issueList.INITIAL_STATE,
    issueMaterialFolders: [],
    issueMaterials: [],
    issues: [],
    issueSharePersons: [],
    labels: [],
    layout: {
        login: loginLayoutInitialState,
        issue: issueLayoutInitialState,
        controls: controlsLayoutInitialState,
        createAbsentiaMeetingForm: null,
        createPresentiaMeetingForm: null,
        meetingAbsentiaForm: null,
        meetingPresentiaForm: null,
        meeting: meetingLayoutInitialState,
        createIssueForm: null,
        agendaItem: agendaItemLayoutInitialState
    },
    materialVersions: [],
    meetings: meetingsInitialState,
    meetingParticipants: [],
    permissions: [],
    persons: [],
    router: '',
    routerHistory: [],
    votes: [],
    votings: []
};
