import {IMeetingsFilter} from '@app/store/meeting/meetings-filter.model';
import {IMeeting} from '@app/store/meeting/meeting.model';
import {IPagingState} from '@app/store/paging.model';

export interface IMeetingsState {
    filter: IMeetingsFilter;
    items: Array<IMeeting>;
    paging: IPagingState;
}

export const meetingsInitialState: IMeetingsState = {
    filter: {},
    items: [],
    paging: {
        pageSize: 20,
        currentPage: 0,
        total: 0
    }
};
