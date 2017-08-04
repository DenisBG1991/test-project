import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {IIssue, IssueActions, IIssueRef} from '@app/store/issue';
import {NgRedux} from '@angular-redux/store';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {IssueMaterialType} from '@app/store/material/material-type.model';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {PersonActions} from '@app/store/person/person.actions';
import {IAppState} from '@app/store/store';
import {IssueSharePersonActions} from '@app/store/issue-share-person/issue-share-person.actions';
import {PermissionActions} from '@app/store/permission/permission.actions';
import {PermissionEnum} from '@app/store/permission';
import {Observable} from 'rxjs/Observable';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';
import {findPersonsByQuery} from '@app/store/person/person.selectors';
import {IMaterialFolder} from '@app/store/material/material-folder.model';
import {IMaterialRef} from '@app/store/material';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {IssueMaterialFolderActions} from '@app/store/issue-material-folder/issue-material-folder.actions';
import {MaterialsUploadingLayoutState} from '@app/store/layout/layout.types';

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

    location = '\\';

    materialExpanded: IMaterialRef;

    canEdit$: Observable<boolean>;
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
            .filter(m => m.issue.id === this.issue.id && m.type === IssueMaterialType.Presentation)
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
            .filter(m => m.issue.id === this.issue.id && m.type === IssueMaterialType.DecisionProject)
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
        this._ngRedux.select(x => x.persons)
            .map(x => findPersonsByQuery(x, this.sharePersonsQuery))
            .filter(f => !!f);


    materialsUploading$: Observable<Array<MaterialsUploadingLayoutState>> =
        this._ngRedux.select(x => x.layout.materialsUploading
            .filter(f => f.location && f.location.startsWith(this.location) &&
            (f.location.split('\\').length - this.location.split('\\').length) === 0));

    versionsUploading$: Observable<Array<{
        location: string,
        material: IMaterialRef,
        upload: { file: File, progress: number }
    }>> =
        this._ngRedux.select(x => x.layout.materialsUploading
            .filter(f => f.material && f.material.id === this.materialExpanded.id));


    /**
     * Подкаталоги текущего каталога текущего вопроса.
     */
    folders$: Observable<Array<IMaterialFolder>> =
        this._ngRedux.select(x => x.issueMaterialFolders
            .filter(f => f.issue.id === this.issue.id && f.location.startsWith(this.location) &&
            (f.location.split('\\').length - this.location.split('\\').length) === 1));

    materials$: Observable<Array<{ self: IIssueMaterial, currentVersion: { self: IMaterialVersion, createdBy: IPerson } }>> =
        this._ngRedux.select(x => x.issueMaterials
            .filter(m => m.issue.id === this.issue.id && m.location === this.location)
            .map(m => {
                const currentVersion = x.materialVersions
                    .find(v => v.id === m.currentVersion.id && v.num === m.currentVersion.num);

                return {
                    self: m,
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

    versions$: Observable<Array<{ self: IMaterialVersion, createdBy: IPerson }>> =
        this._ngRedux.select(x => x.materialVersions
            .filter(v => this.materialExpanded && v.id === this.materialExpanded.id)
            .sort((one, two) => {
                if (one.num > two.num) { // сортируем в обратном порядке
                    return -1;
                }
                if (one.num < two.num) {
                    return 1;
                }
                return 0;
            })
            .map(v => {
                return {
                    self: v,
                    createdBy: x.persons.find(p => p.id === v.createdBy.id)
                };
            }));

    constructor(private _route: ActivatedRoute,
                private _issueActions: IssueActions,
                private _issueSharePersonActions: IssueSharePersonActions,
                private _issueMaterialActions: IssueMaterialActions,
                private _ngRedux: NgRedux<IAppState>,
                private _personActions: PersonActions,
                private _permissionActions: PermissionActions,
                private _permissionSelectors: PermissionSelectors,
                private _materialVersionActions: MaterialVersionActions,
                private _folderActions: IssueMaterialFolderActions) {
    }


    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            this.issue = {
                id: params['id']
            };
            this.canEdit$ = this.hasPermission$(PermissionEnum.EditIssue);
            this._ngRedux.dispatch(this._issueActions.loadIssue(this.issue));
            this._ngRedux.dispatch(this._permissionActions.addIssuePermissions(this.issue));
            this._ngRedux.dispatch(this._issueMaterialActions.loadPresentations(this.issue));
            this._ngRedux.dispatch(this._issueMaterialActions.loadDecisionProjects(this.issue));
            this._ngRedux.dispatch(this._folderActions.loadFolder(this.issue, this.location));
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


    locationChanged(location: string) {
        this.location = location;
        this._ngRedux.dispatch(this._folderActions.loadFolder(this.issue, location));
    }

    materialTypeChanged(materialType: {
        material: IMaterialRef,
        type: IssueMaterialType
    }) {
        this._ngRedux.dispatch(this._issueMaterialActions.changeMaterialType(
            materialType.material, materialType.type));
    }

    materialDeleted(material: IMaterialRef) {
        this._ngRedux.dispatch(this._issueMaterialActions.deleteMaterial(material, this.issue));
    }

    materialsAdded(upload: {
        location: string,
        files: File[]
    }) {
        for (const file of upload.files) {
            this._ngRedux.dispatch(this._issueMaterialActions.uploadIssueMaterial(
                this.issue, upload.location, file));
        }
    }

    versionsAdded(upload: {
        material: IMaterialRef,
        files: File[]
    }) {
        for (const file of upload.files) {
            this._ngRedux.dispatch(this._materialVersionActions.uploadMaterialVersion(upload.material, file));
        }
    }


    materialVersionExpanded(material: IMaterialRef) {
        this.materialExpanded = material;
        this._ngRedux.dispatch(this._materialVersionActions.loadMaterialVersions(material));
    }

}
