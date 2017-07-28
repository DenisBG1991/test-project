import {Injectable} from '@angular/core';
import {IssueMaterialsClient, EditIssueMaterialTypeDto} from '@app/shared/api';
import 'rxjs/add/operator/toPromise';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IMaterialRef} from '@app/store/material';
import {MaterialType} from '@app/store/material/material-type.model';
import {IIssueRef} from '@app/store/issue';
import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IPerson} from '@app/store/person/person.model';
import {IssueMaterial, IssueMaterialFolder, MaterialVersion, Person} from '@app/services/api/mapping.types';
import {Observable} from 'rxjs/Observable';
import {IDecision} from '@app/store/decision/decision.model';


@Injectable()
export class MaterialService {

    constructor(private _client: IssueMaterialsClient) {
    }

    /**
     * Возвращает каталог с материалами вопроса.
     */
    getIssueMaterialsFolder(issue: IIssueRef, location: string): Observable<{
        folders: Array<IIssueMaterialFolder>,
        materials: Array<IIssueMaterial>,
        versions: Array<IMaterialVersion>,
        persons: Array<IPerson>
    }> {
        return this._client.getIssueMaterials(issue.id, location)
            .map(contents => {
                const folders = contents.subFolders.map(f => {
                    const folder = IssueMaterialFolder.parse(f);
                    folder.issue = {
                        id: issue.id
                    };
                    return folder;
                });

                const materials = contents.materials.map(m => {
                    const self = IssueMaterial.parse(m);
                    self.issue = {
                        id: issue.id
                    };

                    const currentVersion = MaterialVersion.parse(m.currentVersion);
                    currentVersion.id = self.id;

                    const createdBy = Person.parse(m.currentVersion.createdBy);

                    return {
                        self: self,
                        currentVersion: currentVersion,
                        createdBy: createdBy
                    };
                });

                return {
                    folders: folders,
                    materials: materials.map(x => x.self),
                    versions: materials.map(x => x.currentVersion),
                    persons: materials.map(x => x.createdBy)
                };
            });
    }

    /**
     * Возвращает презентации вопроса.
     */
    getIssuePresentations(issue: IIssueRef): Observable<{
        materials: Array<IIssueMaterial>,
        versions: Array<IMaterialVersion>,
        persons: Array<IPerson>
    }> {
        return this._client.getIssuePresentations(issue.id)
            .map(dto => {
                const materials = dto.map(m => {
                    const self = IssueMaterial.parse(m);
                    self.issue = {
                        id: issue.id
                    };

                    const currentVersion = MaterialVersion.parse(m.currentVersion);
                    currentVersion.id = self.id;

                    const createdBy = Person.parse(m.currentVersion.createdBy);

                    return {
                        self: self,
                        currentVersion: currentVersion,
                        createdBy: createdBy
                    };
                });

                return {
                    materials: materials.map(x => x.self),
                    versions: materials.map(x => x.currentVersion),
                    persons: materials.map(x => x.createdBy)
                };
            });
    }

    /**
     * Возвращает проекты решений вопроса.
     */
    getIssueDecisionProjects(issue: IIssueRef): Observable<{
        materials: Array<IIssueMaterial>,
        versions: Array<IMaterialVersion>,
        persons: Array<IPerson>,
        decisions: Array<IDecision>
    }> {
        return this._client.getIssueDecisionProjects(issue.id)
            .map(dto => {
                const materials = dto.map(m => {
                    const self = IssueMaterial.parse(m);
                    self.issue = {
                        id: issue.id
                    };

                    const currentVersion = MaterialVersion.parse(m.currentVersion);
                    currentVersion.id = self.id;

                    const createdBy = Person.parse(m.currentVersion.createdBy);

                    // TODO: решения должны быть per Meeting
                    let decision: IDecision = null;
                    if (m.accepted != null) {
                        decision = {
                            id: null,
                            meeting: {
                                id: null
                            },
                            materialVersion: {
                                id: self.id,
                                num: null
                            },
                            accepted: m.accepted,
                            approval: null
                        };
                    }

                    return {
                        self: self,
                        currentVersion: currentVersion,
                        createdBy: createdBy,
                        decision: decision
                    };
                });

                return {
                    materials: materials.map(x => x.self),
                    versions: materials.map(x => x.currentVersion),
                    persons: materials.map(x => x.createdBy),
                    decisions: materials.map(x => x.decision).filter(x => x != null)
                };
            });
    }

    /**
     * Возвращает версии материала.
     */
    getMaterialVersions(material: IMaterialRef): Observable<{
        versions: Array<IMaterialVersion>,
        persons: Array<IPerson>
    }> {
        return this._client.getMaterialVersions(material.id)
            .map(dto => {
                const versions = dto.map(m => {
                    const self = MaterialVersion.parse(m);
                    self.id = material.id;

                    const createdBy = Person.parse(m.createdBy);

                    return {
                        self: self,
                        createdBy: createdBy
                    };
                });

                return {
                    versions: versions.map(x => x.self),
                    persons: versions.map(x => x.createdBy)
                };
            });
    }

    /**
     * Изменяет тип/категорию материала.
     */
    changeMaterialType(issue: IIssueRef, material: IMaterialRef, type: MaterialType): Observable<void> {
        return this._client.changeType(issue.id, material.id, new EditIssueMaterialTypeDto({
            type: type
        }));
    }

    /**
     * Удаляет материал.
     */
    deleteMaterial(material: IMaterialRef): Observable<void> {
        return this._client.delete(material.id);
    }
}
