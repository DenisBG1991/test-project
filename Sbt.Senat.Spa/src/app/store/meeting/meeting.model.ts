import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {MeetingStatus} from '@app/store/meeting/meeting-status';

export interface IMeeting extends IMeetingRef {
    num: string;
    collegialBody: ICollegialBody;
    type: MeetingType;
    agendaDueDate: Date;
    materialsDueDate: Date;
    state: MeetingStatus;
    hasProtocol: boolean;
}

export interface IMeetingPresentia extends IMeeting {
    date: Date;
    place: string;
    address: string;
}

export interface IMeetingPresentiaMultilingual extends IMeeting {
    date: Date;
    place: { [key: string]: string };
    address: { [key: string]: string };
}

export interface IMeetingAbsentia extends IMeeting {
    startDate: Date;
    endDate: Date;
}

export enum MeetingType {
    Presentia = <any>'Presentia',
    Absentia = <any>'Absentia'
}
