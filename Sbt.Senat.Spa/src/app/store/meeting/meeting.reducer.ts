import {MeetingActions} from '@app/store/meeting/meeting.actions';
import {IMeetingsState, meetingsInitialState} from '@app/store/meeting/meetings-state.model';

export function meetingReducer(state: IMeetingsState = meetingsInitialState, action): IMeetingsState {
    switch (action.type) {

        case MeetingActions.UpdateMeetingsFilter:
            return {
                filter: action.payload.filter,
                items: state.items,
                paging: state.paging
            };

        case MeetingActions.LoadMeetingsPageComplete:
            return {
                filter: state.filter,
                items: action.payload.page.pageNum === 1
                    ? action.payload.page.items
                    : state.items.concat(action.payload.page.items),
                paging: {
                    currentPage: action.payload.page.pageNum,
                    pageSize: action.payload.page.pageSize,
                    total: action.payload.page.itemsTotal
                }
            };

        case MeetingActions.LoadSingleMeetingComplete:
            return {
                filter: state.filter,
                items: state.items.filter(x => x.id !== action.payload.meeting.id)
                    .concat(action.payload.meeting),
                paging: state.paging
            };
        case MeetingActions.FormMeetingProtocolComplete:
            const currentMeeting = state.items.find(x => x.id === action.payload.meeting.id);
            
            if (currentMeeting) {
                currentMeeting.hasProtocol = true;
            }
            return {
                filter: state.filter,
                items: state.items.filter(x => x.id !== action.payload.meeting.id)
                    .concat([currentMeeting]),
                paging: state.paging
            };

        default:
            return state;
    }
}
