import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {IIssue, IssueActions, IIssueRef} from '@app/store/issue';
import {NgRedux} from '@angular-redux/store';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {MaterialType} from '@app/store/material/material-type.model';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {IAppState} from '@app/store/store';
import {IssueSharePersonActions} from '@app/store/issue-share-person/issue-share-person.actions';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {PermissionEnum} from '@app/store/permission';
import {Observable} from 'rxjs/Observable';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {findPersonsByQuery} from '@app/store/person/person.selectors';

@Component({
    selector: 'senat-issue',
    templateUrl: './issue-page-content.component.html',
    styleUrls: ['./issue-page-content.component.css'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class IssuePageContentComponent implements OnInit {

    showShare: boolean;
    issue: IIssueRef;
    sharePersonsQuery: string;
    pe = PermissionEnum;

    //noinspection JSUnusedGlobalSymbols
    /**
     * Презентации.
     */
    presentations$: Observable<Array<{
        currentVersion: {
            self: IMaterialVersion,
            createdBy: IPerson
        }
    }>> =
        this._ngRedux.select(x => x.issueMaterials
            .filter(m => m.issue.id === this.issue.id && m.type === MaterialType.Presentation)
            .map(m => {
                const currentVersion = x.materialVersions.find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);
                return {
                    currentVersion: {
                        self: currentVersion,
                        createdBy: x.persons.find(p => p.id === currentVersion.createdBy.id)
                    }
                };
            })
            .sort((one, two) => {
                if (one.currentVersion.self.fileName > two.currentVersion.self.fileName) {
                    return 1;
                }
                if (one.currentVersion.self.fileName < two.currentVersion.self.fileName) {
                    return -1;
                }
                return 0;
            }));

    //noinspection JSUnusedGlobalSymbols
    /**
     * Проекты решений.
     */
    decisionProjects$: Observable<Array<{
        currentVersion: {
            self: IMaterialVersion,
            createdBy: IPerson
        }
    }>> =
        this._ngRedux.select(x => x.issueMaterials
            .filter(m => m.issue.id === this.issue.id && m.type === MaterialType.DecisionProject)
            .map(m => {
                const currentVersion = x.materialVersions.find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);
                return {
                    currentVersion: {
                        self: currentVersion,
                        createdBy: x.persons.find(p => p.id === currentVersion.createdBy.id)
                    }
                };
            })
            .sort((one, two) => {
                if (one.currentVersion.self.fileName > two.currentVersion.self.fileName) {
                    return 1;
                }
                if (one.currentVersion.self.fileName < two.currentVersion.self.fileName) {
                    return -1;
                }
                return 0;
            }));

    issue$: Observable<IIssue> =
        this._ngRedux.select(x => x.issue.issue);


    sharePersons$: Observable<IPerson[]> =
        this._ngRedux.select(x => x.issueSharePersons
            .filter(p => p.issue.id === this.issue.id)
            .map(p => x.persons.find(person => person.id === p.id)));

    sharePersonsSuggestions$: Observable<Array<IPerson>> =
        this._ngRedux.select(x => findPersonsByQuery(x, this.sharePersonsQuery));

    constructor(private _route: ActivatedRoute,
                private _issueActions: IssueActions,
                private _issueSharePersonActions: IssueSharePersonActions,
                private _issueMaterialActions: IssueMaterialActions,
                private _ngRedux: NgRedux<IAppState>,
                private _personActions: PersonActions,
                private _permissionActions: PermissionActions,
                private _permissionSelectors: PermissionSelectors) {
    }


    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            this.issue = {
                id: params['id']
            };

            this._ngRedux.dispatch(this._issueActions.loadIssue(this.issue));
            this._ngRedux.dispatch(this._permissionActions.addIssuePermissions(this.issue));
            this._ngRedux.dispatch(this._issueMaterialActions.loadPresentations(this.issue));
            this._ngRedux.dispatch(this._issueMaterialActions.loadDecisionProjects(this.issue));
        });
    }

    findPeople(query: string) {
        this.sharePersonsQuery = query;
        this._ngRedux.dispatch(this._personActions.loadPersons(query));
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.issueHasPermision(permission, this.issue));
    }



    showHideShare() {
        if (!this.showShare) {
            this._ngRedux.dispatch(this._issueSharePersonActions.loadSharePersons(this.issue));
        }
        this.showShare = !this.showShare;
    }

    removeSharePerson(person: IPerson) {
        this._ngRedux.dispatch(this._issueSharePersonActions.removeSharePerson(this.issue, person));
    }

    addSharePerson(person: IPerson) {
        this._ngRedux.dispatch(this._issueSharePersonActions.addSharePerson(this.issue, person));
    }


}
