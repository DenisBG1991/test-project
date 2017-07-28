import {IHolding, IHoldingRef} from '@app/store/holding/holding.model';
import {ICompanyRef, ICompany} from '@app/store/company/company.model';
import {ICollegialBody, ICollegialBodyRef} from '@app/store/collegial-body/collegial-body.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IIssueRef} from '@app/store/issue';
export interface IPermission {
    holding: IHoldingRef,
    company: ICompanyRef,
    collegialBody: ICollegialBodyRef,
    meeting: IMeetingRef,
    issue: IIssueRef,
    permission: PermissionEnum,
    permissionLevel: PermissionLevelEnum
}

export interface IAdminPermission {
    holding: IHoldingRef,
    company: ICompanyRef,
    collegialBody: ICollegialBodyRef,
    permission: PermissionEnum,
    permissionLevel: PermissionLevelEnum
}

export enum PermissionEnum {

    CreateIssue = 1,
    ViewIssue,
    EditIssue,
    DeleteIssue,
    WorkWithMyIssue,
    CreateMeeting,
    ViewMeeting,
    EditMeeting,
    DeleteMeeting,
    Admin,
    CreatePerson,
    EditPerson,
    EditUserRole
}

export enum PermissionLevelEnum {

    Root = 1,
    Holding,
    Company,
    CollegialBody,
    Meeting,
    Issue
}


