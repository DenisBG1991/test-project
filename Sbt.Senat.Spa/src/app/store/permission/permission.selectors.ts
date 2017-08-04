import {Injectable} from '@angular/core';
import {IPermission, PermissionEnum} from '@app/store/permission';
import {IAppState} from '@app/store/store';
import {IIssueRef} from '@app/store/issue';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class PermissionSelectors {

    issueHasPermision(permission: PermissionEnum, issue: IIssueRef): (state: IAppState) => boolean {
        return x => x.permissions.some(p => p.permission === permission && p.issue && issue && p.issue.id === issue.id);
    }

    meetingHasPermision(permission: PermissionEnum, meeting: IMeetingRef): (state: IAppState) => boolean {
        return x => x.permissions.some(p => p.permission === permission && p.meeting && meeting && p.meeting.id === meeting.id);
    }

    /**
     * Extension method for providing permission checking as Observable. Prefer it in situations, where one of parameters
     * can be uninitialized one time
     * @param permission
     * @param meeting$
     * @returns {any}
     */
     meetingHasPermission$(permissions$: Observable<Array<IPermission>>, permission: PermissionEnum, meeting$: Observable<IMeetingRef>): Observable<boolean> {
        return permissions$.combineLatest(meeting$, (permissions, meeting) =>
            permissions.some(p => p.permission === permission && p.meeting && meeting && p.meeting.id === meeting.id)
        );
    }

    /**
     * Extension method for providing permission checking as Observable. Prefer it in situations, where one of parameters
     * @param permission
     * @param issue$
     * @returns {any}
     */
     issueHasPermission$(permissions$: Observable<Array<IPermission>>, permission: PermissionEnum, issue$: Observable<IIssueRef>): Observable<boolean> {
        return permissions$.combineLatest(issue$, (permissions, issue) =>
            permissions.some(p => p.permission === permission && p.issue && issue && p.issue.id === issue.id)
        );
    }

    /**
     * Поиск разрешений в вопросах и заседаниях
     * @param permissions
     * @returns {(x:any)=>ICollegialBody[]}
     */
    collegialBodyChildPermissionsFilter(permissions: PermissionEnum[]): (state: IAppState) => ICollegialBody[] {
        return x => x.collegialBodies
            .filter(c => c.holding && x.permissions.some(p => permissions.some(s => s === p.permission)
            && (
                (p.permissionLevel === PermissionLevelEnum.Holding && p.holding.id === c.holding.id )
                || (p.permissionLevel === PermissionLevelEnum.Company && p.company.id === c.company.id )
                || (p.permissionLevel >= PermissionLevelEnum.CollegialBody && p.collegialBody && p.collegialBody.id === c.id)
            )));
    }

    collegialBodyPermissionFilter(permission: PermissionEnum): (state: IAppState) => ICollegialBody[] {
        return x => x.collegialBodies
            .filter(c => c.holding && x.permissions.some(p => p.permission === permission
            && (
                (p.permissionLevel === PermissionLevelEnum.Holding && p.holding.id === c.holding.id )
                || (p.permissionLevel === PermissionLevelEnum.Company && p.company.id === c.company.id )
                || (p.permissionLevel === PermissionLevelEnum.CollegialBody && p.collegialBody.id === c.id)
            )));
    }
}
