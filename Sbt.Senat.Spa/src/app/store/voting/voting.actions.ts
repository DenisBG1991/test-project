import {Injectable} from '@angular/core';
import {IAgendaItemRef} from '@app/store/agenda-item/agenda-item.model';
import {IVoting, IVotingRef} from '@app/store/voting/voting.model';
import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';

@Injectable()
export class VotingActions {

    static readonly LoadAgendaItemVotings = 'LOAD_AGENDA_ITEM_VOTINGS';
    static readonly LoadVotingsComplete = 'LOAD_AGENDA_ITEM_VOTINGS_COMPLETE';
    static readonly CreateVoting = 'CREATE_VOTING';
    static readonly CloseVoting = 'CLOSE_VOTING';

    loadAgendaItemVotings(agendaItem: IAgendaItemRef) {
        return {
            type: VotingActions.LoadAgendaItemVotings,
            payload: {
                agendaItem: agendaItem
            }
        };
    }

    loadVotingsComplete(votings: Array<IVoting>) {
        return {
            type: VotingActions.LoadVotingsComplete,
            payload: {
                votings: votings
            }
        };
    }

    createVoting(meeting: IMeetingRef, project: IMaterialVersionRef) {
        return {
            type: VotingActions.CreateVoting,
            payload: {
                meeting: meeting,
                project: project
            }
        };
    }

    closeVoting(voting: IVotingRef) {
        return {
            type: VotingActions.CloseVoting,
            payload: {
                voting: voting
            }
        };
    }
}
