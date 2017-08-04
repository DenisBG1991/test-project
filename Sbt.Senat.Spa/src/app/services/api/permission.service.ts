import {Injectable} from '@angular/core';
import {
    PermissionClient, PermissionEnumDto, UserRoleGroupFilterDto, PermissionLevelDto,
    PermissionFilterDto, RoleFilterDto, CreateUserRoleDto,
    UserRoleDetailedFilterDto
} from '@app/shared/api';
import {IPermission, PermissionEnum} from '@app/store/permission';
import {Observable} from 'rxjs/Observable';
import {PermissionLevelEnum} from '@app/store/permission/permission.model';
import {IPermissionFilter} from '@app/store/permission/permission-filter.model';
import {IRole, IRoleRef} from '@app/store/admin/role/role.model';
import {IUserRole, IUserRoleRef} from '@app/store/admin/user-role/user-role.model';
import {ICollegialBodyRef} from '@app/store/collegial-body/collegial-body.model';
import {ICompanyRef} from '@app/store/company/company.model';
import {IHoldingRef} from '@app/store/holding/holding.model';
import {IPage, IPageInfo} from '@app/store/paging.model';
import {IUserRoleFilter} from '@app/store/admin/user-role/user-role-filter.model';

@Injectable()
export class PermissionService {
    constructor(private _client: PermissionClient) {
    }


    getPermissions(filter: IPermissionFilter): Observable<PermissionEnum[]> {
        return this._client.getPermissions(new PermissionFilterDto({
            issueId: filter.issue ? filter.issue.id : null,
            meetingId: filter.meeting ? filter.meeting.id : null
        })).map(r =>
            r.items.map(m => this.mapPermissionEnum(m)));
    }

    getGroupPermissions(): Observable<IPermission[]> {
        return this._client.getGroupPermissions(new UserRoleGroupFilterDto()).map(r =>
            r.map(m => {
                return {
                    holding: m.holding ? {
                        id: m.holding.id
                    } : null,
                    company: m.company ? {
                        id: m.company.id
                    } : null,
                    collegialBody: m.collegialBody ? {
                        id: m.collegialBody.id
                    } : null,
                    meeting: null,
                    issue: null,
                    permission: this.mapPermissionEnum(m.permission),
                    permissionLevel: this.mapPermissionLevelEnum(m.permissionLevel)
                };
            }));
    }

    getRoles(): Observable<IRole[]> {
        return this._client.getRoles(new RoleFilterDto())
            .map(m => m.map(r => {
                return {
                    id: r.id,
                    name: r.name,
                    permissionLevel: this.mapPermissionLevelEnum(r.permissionLevel)
                };
            }));
    }

    getUserRoles(criteria: IUserRoleFilter, paging: IPageInfo): Observable<IPage<IUserRole>> {
        return this._client.getUserRoles(new UserRoleDetailedFilterDto({
                userId: criteria.userId,
                permissionLevels: criteria.permissionLevels ? criteria.permissionLevels.map(m => this.mapPermissionLevelDto(m)) : null,
                page: paging.pageNum,
                size: paging.pageSize
            }))
            .map(page => {
                const items = page.items.map(m => {
                    const ret: IUserRole = {
                        id: m.id,
                        holding: m.holding ? {
                            id: m.holding.id,
                            name: m.holding.displayName
                        } : null,
                        company: m.company ? {
                            id: m.company.id,
                            name: m.company.displayName
                        } : null,
                        collegialBody: m.collegialBody ? {
                            id: m.collegialBody.id,
                            name: m.collegialBody.displayName
                        } : null,
                        role: {
                            id: m.role.id,
                            name: m.role.name,
                            permissionLevel: this.mapPermissionLevelEnum(m.role.permissionLevel)
                        },
                        userId: m.userId
                    };
                    return ret;

                });
                return {
                    pageNum: page.pageNum,
                    pageSize: page.pageSize,
                    items: items,
                    itemsTotal: page.itemsTotal
                };
            });
    }

    createUserRole(userRole: {
                       userId: string,
                       role: IRoleRef,
                       collegialBody: ICollegialBodyRef,
                       company: ICompanyRef,
                       holding: IHoldingRef
                   }): Observable<IUserRole> {
        return this._client.createUserRole(new CreateUserRoleDto({
                userId: userRole.userId,
                role: {
                    id: userRole.role.id
                },
                collegialBody: userRole.collegialBody ? {
                    id: userRole.collegialBody.id
                } : null,
                company: userRole.company ? {
                    id: userRole.company.id
                } : null,
                holding: userRole.holding ? {
                    id: userRole.holding.id
                } : null
            }))
            .map(m => {
                return {
                    id: m.id,
                    holding: m.holding ? {
                        id: m.holding.id,
                        name: m.holding.displayName
                    } : null,
                    company: m.company ? {
                        id: m.company.id,
                        name: m.company.displayName
                    } : null,
                    collegialBody: m.collegialBody ? {
                        id: m.collegialBody.id,
                        name: m.collegialBody.displayName
                    } : null,
                    role: {
                        id: m.role.id,
                        name: m.role.name,
                        permissionLevel: this.mapPermissionLevelEnum(m.role.permissionLevel)
                    },
                    userId: m.userId
                };
            });
    }

    deleteUserRole(userRole: IUserRoleRef): Observable<void> {
        return this._client.deleteUserRole(userRole.id);
    }


    private mapPermissionEnum(dto: PermissionEnumDto): PermissionEnum {
        switch (dto) {
            case PermissionEnumDto.CreateMeeting:
                return PermissionEnum.CreateMeeting;
            case PermissionEnumDto.CreateIssue:
                return PermissionEnum.CreateIssue;
            case PermissionEnumDto.DeleteIssue:
                return PermissionEnum.DeleteIssue;
            case PermissionEnumDto.DeleteMeeting:
                return PermissionEnum.DeleteMeeting;
            case PermissionEnumDto.EditIssue:
                return PermissionEnum.EditIssue;
            case PermissionEnumDto.EditMeeting:
                return PermissionEnum.EditMeeting;
            case PermissionEnumDto.ViewIssueInAgenda:
                return PermissionEnum.ViewIssueInAgenda;
            case PermissionEnumDto.ViewIssue:
                return PermissionEnum.ViewIssue;
            case PermissionEnumDto.ViewMeeting:
                return PermissionEnum.ViewMeeting;
            case PermissionEnumDto.WorkWithMyIssue:
                return PermissionEnum.WorkWithMyIssue;
            case PermissionEnumDto.Admin:
                return PermissionEnum.Admin;
            case PermissionEnumDto.CreatePerson:
                return PermissionEnum.CreatePerson;
            case PermissionEnumDto.EditPerson:
                return PermissionEnum.EditPerson;
            case PermissionEnumDto.EditUserRole:
                return PermissionEnum.EditUserRole;

            default:
                return null;
        }
    }

    private mapPermissionLevelEnum(dto: PermissionLevelDto): PermissionLevelEnum {
        switch (dto) {
            case PermissionLevelDto.Issue:
                return PermissionLevelEnum.Issue;
            case PermissionLevelDto.Meeting:
                return PermissionLevelEnum.Meeting;
            case PermissionLevelDto.CollegialBody:
                return PermissionLevelEnum.CollegialBody;
            case PermissionLevelDto.Company:
                return PermissionLevelEnum.Company;
            case PermissionLevelDto.Holding:
                return PermissionLevelEnum.Holding;
            case PermissionLevelDto.Root:
                return PermissionLevelEnum.Root;
            default:
                return null;
        }
    }

    private mapPermissionLevelDto(dto: PermissionLevelEnum): PermissionLevelDto {
        switch (dto) {
            case PermissionLevelEnum.Issue:
                return PermissionLevelDto.Issue;
            case PermissionLevelEnum.Meeting:
                return PermissionLevelDto.Meeting;
            case PermissionLevelEnum.CollegialBody:
                return PermissionLevelDto.CollegialBody;
            case PermissionLevelEnum.Company:
                return PermissionLevelDto.Company;
            case PermissionLevelEnum.Holding:
                return PermissionLevelDto.Holding;
            case PermissionLevelEnum.Root:
                return PermissionLevelDto.Root;
            default:
                return null;
        }
    }

}
