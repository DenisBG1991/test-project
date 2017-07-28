import {Injectable} from '@angular/core';
import {IssuesClient, IssuesFilterDto} from '@app/shared/api/client/reference/api.reference';
import {
    CreateIssueDto, EditIssueDto, IssueShareDto
} from '@app/shared/api/client/reference/api.reference';
import {IssueDto, IssueTransitionDto} from '@app/shared/api';
import {IIssueListItem, IIssueListFilter} from '@app/store/issue-list';
import {IIssue, IIssueRef} from '@app/store/issue';
import {ILabel} from '@app/store/label';
import {IPerson, IPersonRef} from '@app/store/person/person.model';
import {IPage, IPageInfo} from '@app/store/paging.model';
import {ICollegialBodyRef} from '@app/store/collegial-body/collegial-body.model';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class IssueService {
    constructor(private _client: IssuesClient) {
    }

    getIssues(criteria: IIssueListFilter, paging: IPageInfo): Observable<IPage<IIssueListItem>> {
        return this._client.getIssues(new IssuesFilterDto({
            collegialBodyId: (criteria.collegialBody ? criteria.collegialBody.id : null),
            title: criteria.title,
            from: criteria.from,
            labels: criteria.labels ? criteria.labels.map(l => l.name).join(',') : null,
            speaker: criteria.speaker,
            to: criteria.to,
            page: paging.pageNum,
            size: paging.pageSize
        })).map(page => {
            const items = page.items.map(dto => {
                const ret: IIssueListItem = {
                    id: dto.id,
                    title: dto.title,
                    description: dto.description,
                    createDate: dto.createDate,
                    author: {
                        id: dto.author.id,
                        lastName: dto.author.info.lastName,
                        firstName: dto.author.info.firstName,
                        middleName: dto.author.info.middleName,
                        pictureUrl: dto.author.info.profileUrl
                    },
                    estimate: dto.estimate,
                    status: dto.status,
                    collegialBody: {
                        id: dto.collegialBody.id,
                        name: dto.collegialBody.name,
                        company: null,
                        holding: null
                    },
                    labels: dto.labels.map(l => {
                        const lblret: ILabel = {
                            id: l.id,
                            name: l.name
                        };
                        return lblret;
                    })


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

    getIssue(id: string): Observable<IIssue> {
        return this._client.getIssue(id)
            .map(dto => this.mapIssue(dto));
    }

    createIssue(issue: IIssue): Observable<IIssue> {
        return this._client.createIssue(new CreateIssueDto({
            author: issue.author,
            title: issue.title,
            description: issue.description,
            labels: issue.labels,
            estimate: issue.estimate,
            collegialBody: issue.collegialBody
        })).map(dto => this.mapIssue(dto));
    }


    editIssue(id: string, issue: IIssue): Observable<IIssue> {
        return this._client.editIssue(id, new EditIssueDto({
            author: issue.author,
            title: issue.title,
            description: issue.description,
            labels: issue.labels,
            estimate: issue.estimate
        })).map(dto => this.mapIssue(dto));
    }

    delete(issue: IIssueRef): Observable<void> {
        return this._client.deleteIssue(issue.id);
    }


    shareIssue(issue: IIssueRef, person: IPersonRef): Observable<void> {
        return this._client.shareIssue(issue.id, new IssueShareDto({
            employeeId: person.id
        }));
    }

    deleteIssueShare(issue: IIssueRef, person: IPersonRef): Observable<void> {
        return this._client.deleteIssueShare(issue.id, person.id);
    }

    getShareIssuePersons(issue: IIssueRef): Observable<IPerson[]> {
        return this._client.getShareIssueEmployees(issue.id)
            .map(items => items.map(dto => {
                const author: IPerson = {
                    id: dto.id,
                    lastName: dto.info.lastName,
                    firstName: dto.info.firstName,
                    middleName: dto.info.middleName,
                    pictureUrl: dto.info.profileUrl
                };
                return author;
            }));
    }

    moveIssueState(issueId: string, action: string): Observable<IIssue> {
        return this._client.moveIssueState(issueId, IssueTransitionDto[action])
            .map(x => this.mapIssue(x));
    }

    private mapIssue(dto: IssueDto): IIssue {
        const issueRet: IIssue = {
            id: dto.id,
            title: dto.title,
            description: dto.description,
            status: dto.status,
            estimate: dto.estimate,
            author: {
                id: dto.author.id,
                lastName: dto.author.info.lastName,
                firstName: dto.author.info.firstName,
                middleName: dto.author.info.middleName,
                pictureUrl: dto.author.info.profileUrl
            },
            collegialBody: {
                id: dto.collegialBody.id,
                name: dto.collegialBody.name,
                company: null,
                holding: null
            },
            labels: dto.labels.map(l => {
                const lblret: ILabel = {
                    id: l.id,
                    name: l.name
                };
                return lblret;
            })
            // permissions: (dto.permissions || []).map(x => x)
        };
        return issueRet;
    }

    findIssues(collegialBody: ICollegialBodyRef, query): Observable<Array<IIssue>> {
        return this._client.getIssues(new IssuesFilterDto({
            collegialBodyId: collegialBody.id,
            title: query,
            size: 10
        })).map(page => {
            const items = page.items.map(dto => {
                const issue: IIssue = {
                    id: dto.id,
                    title: dto.title as any, // TODO: разобраться с моделями вопроса
                    description: dto.description as any,
                    author: {
                        id: dto.author.id,
                        lastName: dto.author.info.lastName,
                        firstName: dto.author.info.firstName,
                        middleName: dto.author.info.middleName,
                        pictureUrl: dto.author.info.profileUrl
                    },
                    estimate: dto.estimate,
                    status: dto.status,
                    collegialBody: {
                        id: dto.collegialBody.id,
                        name: dto.collegialBody.name,
                        company: null,
                        holding: null
                    },
                    labels: dto.labels.map(l => {
                        const lblret: ILabel = {
                            id: l.id,
                            name: l.name
                        };
                        return lblret;
                    }),
                    createDate: dto.createDate


                };
                return issue;

            });

            return items;
        });
    }
}
