import {Injectable} from '@angular/core';
import {IssueMaterialsClient} from '@app/shared/api';
import 'rxjs/add/operator/toPromise';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IMaterialRef} from '@app/store/material';
import {IssueMaterialType} from '@app/store/material/material-type.model';
import {IIssueRef} from '@app/store/issue';
import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IPerson} from '@app/store/person/person.model';
import {
    AgendaItemMaterial,
    AgendaItemMaterialFolder,
    IssueMaterial,
    IssueMaterialFolder,
    MaterialVersion,
    MeetingMaterial,
    Person
} from '@app/services/api/mapping.types';
import {Observable} from 'rxjs/Observable';
import {Progress, UploadService} from '@app/services/uploads';
import {CustomHttp} from '@app/services/api/http';
import {ApiService} from '@app/services/api/api.service';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IAgendaItemMaterialFolder} from '@app/store/agenda-item-material-folder/agenda-item-material-folder.model';
import {IAgendaItemMaterial} from '@app/store/agenda-item-material/agenda-item-material.model';
import {IAgendaItemIdRef} from '@app/store/agenda-item/agenda-item.model';
import {IMeetingMaterial} from '@app/store/meeting-material/meeting-material.model';


@Injectable()
export class MaterialService extends ApiService {

    constructor(http: CustomHttp,
                private _client: IssueMaterialsClient, private  _uploadService: UploadService) {
        super(http);
    }

    uploadMaterial(issue: IIssueRef, location: string, file: File): {
        progress$: Observable<Progress>,
        result$: Observable<any>
    } {
        return this._uploadService.upload(`api/web/issues/${issue.id}/materials?location=${location}`, file);
    }

    uploadVersion(material: IMaterialRef, file: File): {
        progress$: Observable<Progress>,
        result$: Observable<any>
    } {
        return this._uploadService.upload(`api/v2.0/materials/${material.id}/versions`, file);
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
        persons: Array<IPerson>
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
    changeMaterialType(material: IMaterialRef, type: IssueMaterialType): Observable<void> {
        return this.http.put(`api/v2.0/materials/${material.id}/category/${type}`, null, this.defaultRequestOptions)
            .map(response => {
                return;
            });
    }


    /**
     * Удаляет материал.
     */
    deleteMaterial(material: IMaterialRef): Observable<void> {
        return this._client.delete(material.id);
    }


    getAgendaItemMaterialsFolder(agendaItem: IAgendaItemIdRef, path: string): Observable<{
        folders: Array<IAgendaItemMaterialFolder>,
        materials: Array<IAgendaItemMaterial>,
        versions: Array<IMaterialVersion>,
        persons: Array<IPerson>
    }> {

        return this.http.get(`api/v2.0/agendaItems/${agendaItem.id}/materials?path=${path}`, this.defaultRequestOptions)
            .map(response => {
                const contents = response.json();

                const folders = contents.filter(f => f.type === 'Folder')
                    .map(f => {
                        const folder = AgendaItemMaterialFolder.parse(f);
                        folder.agendaItem = {
                            id: agendaItem.id
                        };
                        folder.location = path + folder.name + '\\';
                        return folder;
                    });


                const materials = contents.filter(f => f.type === 'Material')
                    .map(m => {
                        const self = AgendaItemMaterial.parse(m);

                        self.agendaItem = {
                            id: agendaItem.id
                        };
                        self.location = path;

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


    getAgendaItemPresentations(agendaItem: IAgendaItemIdRef, issue: IIssueRef, meeting: IMeetingRef): Observable<{
        materials: Array<IAgendaItemMaterial>,
        versions: Array<IMaterialVersion>,
        persons: Array<IPerson>
    }> {

        return this.http.get(`api/web/meetings/${meeting.id}/agenda/${issue.id}/presentations`, this.defaultRequestOptions)
            .map(response => {
                const contents = response.json();
                const materials = contents.map(m => {
                    const self = AgendaItemMaterial.parse(m);
                    self.agendaItem = {
                        id: agendaItem.id
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
    getAgendaItemDecisionProjects(agendaItem: IAgendaItemIdRef, issue: IIssueRef, meeting: IMeetingRef): Observable<{
        materials: Array<IAgendaItemMaterial>,
        versions: Array<IMaterialVersion>,
        persons: Array<IPerson>
    }> {
        return this.http.get(`api/web/meetings/${meeting.id}/agenda/${issue.id}/decisionProjects`, this.defaultRequestOptions)
            .map(response => {
                const contents = response.json();
                const materials = contents.map(m => {
                    const self = AgendaItemMaterial.parse(m);
                    self.agendaItem = {
                        id: agendaItem.id
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

    getMeetingProtocol(meeting: IMeetingRef): Observable<{ material: IMeetingMaterial, person: IPerson, version: IMaterialVersion }> {
        return this.http.get(`api/web/meetings/${meeting.id}/materials/protocol`, this.defaultRequestOptions)
            .map(response => {
                const material = response.json();
                const self = MeetingMaterial.parse(material);

                self.meeting = {
                    id: meeting.id
                };

                const currentVersion = MaterialVersion.parse(material.currentVersion);
                currentVersion.id = self.id;

                const createdBy = Person.parse(material.currentVersion.createdBy);

                return {
                    material: self,
                    version: currentVersion,
                    person: createdBy
                };
            });
    }

    uploadAgendItemMaterial(agendaItem: IAgendaItemIdRef, path: string, file: File): {
        progress$: Observable<Progress>,
        result$: Observable<any>
    } {
        return this._uploadService.upload(`api/v2.0/agendaItems/${agendaItem.id}/materials?path=${path}`, file);
    }

    uploadVersionV2(material: IMaterialRef, file: File): {
        progress$: Observable<Progress>,
        result$: Observable<any>
    } {
        return this._uploadService.upload(`api/v2.0/materials/${material.id}/versions`, file);
    }
}
