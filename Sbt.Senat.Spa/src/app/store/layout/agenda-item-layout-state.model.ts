import {IPersonRef} from '@app/store/person/person.model';

export interface IAgendaItemLayoutState {
    attendees: Array<{person: IPersonRef, presents: boolean, prevPresents: boolean}>;
}

export const agendaItemLayoutInitialState = {
    attendees: []
};

