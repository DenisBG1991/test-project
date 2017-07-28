import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Input, OnInit} from '@angular/core';
import {IIssueRef} from '@app/store/issue';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IMaterialRef} from '@app/store/material/material.model';
import {Observable} from 'rxjs/Observable';
import {IssueMaterialFolderActions} from '@app/store/issue-material-folder/issue-material-folder.actions';
import {MaterialType} from '@app/store/material/material-type.model';
import {IMaterial} from '@app/store/material';
import {IssueMaterialActions} from '@app/store/issue-material/issue-material.actions';
import {MaterialVersionActions} from '@app/store/material-version/material-version.actions';
import {UploadService} from '@app/services/uploads';
import {AppConfigInjectionToken, IAppConfig} from '@app/config';
import {PersonActions} from '@app/store/person/person.actions';
import {ErrorActions} from '@app/store/error/error.actions';
import {PermissionEnum} from '@app/store/permission';
import {PermissionSelectors} from '@app/store/permission/permission.selectors';

@Component({
    selector: 'senat-material-browser',
    templateUrl: './material-browser.component.html',
    styleUrls: ['./material-browser.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialBrowserComponent implements OnInit {

    /**
     * Текущий вопрос.
     */
    @Input()
    issue: IIssueRef;

    /**
     * Текущий каталог.
     * @type {string}
     */
    @Input()
    location = '\\';

    /**
     * Материал, чьи версии развёрнуты.
     */
    @Input()
    materialExpanded: IMaterialRef;

    get canEdit$(): Observable<boolean> {
        return this.hasPermission$(PermissionEnum.EditIssue);
    }

    /**
     * Версии материалов, находящиеся в процессе загрузки.
     */
    versionsUploading: Array<{ material: IMaterialRef, upload: { file: File, progress: number } }> = [];

    /**
     * Материалы, находящиеся в процессе загрузки.
     */
    materialsUploading: Array<{ location: string, upload: { file: File, progress: number } }> = [];

    /**
     * Сегменты пути к текущему каталогу материалов (для переходов по каталогам).
     */
    get pathSegments(): Array<{ name: string, location: string }> {
        let location = '';

        const locationParts = this.location.split('\\').filter(l => l !== '');

        if (locationParts.length === 0) {
            return [{
                name: 'корневой каталог',
                location: '\\'
            }];
        }

        return [{
            name: '',
            location: '\\'
        }].concat(locationParts
            .map(x => {
                const segment = {
                    name: x,
                    location: location + '\\'
                };

                location = `${location}\\${x}`;

                return segment;
            }));
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Все материалы текущего вопроса.
     */
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

    //noinspection JSUnusedGlobalSymbols
    /**
     * Подкаталоги текущего каталога текущего вопроса.
     */
    folders$: Observable<Array<IIssueMaterialFolder>> =
        this._ngRedux.select(x => x.issueMaterialFolders
            .filter(f => f.issue.id === this.issue.id && f.location.startsWith(this.location) &&
            (f.location.split('\\').length - this.location.split('\\').length) === 1));

    //noinspection JSUnusedGlobalSymbols
    /**
     * Версии материала (того, который раскрыт).
     * @returns {Observable<S>}
     */
    versions$: Observable<Array<{ self: IMaterialVersion, createdBy: IPerson }>> =
        this._ngRedux.select(x => x.materialVersions
            .filter(v => v.id === this.materialExpanded.id)
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

    constructor(private _ngRedux: NgRedux<IAppState>,
                private _folderActions: IssueMaterialFolderActions,
                private _issueMaterialActions: IssueMaterialActions,
                private _materialVersionActions: MaterialVersionActions,
                private _personActions: PersonActions,
                private _errorActions: ErrorActions,
                private _uploadService: UploadService,
                @Inject(AppConfigInjectionToken) private _appConfig: IAppConfig,
                private _changeDetectorRef: ChangeDetectorRef,
                private _permissionSelectors: PermissionSelectors) {
    }

    ngOnInit() {
        // загружаем текущий каталог (корневой)
        this._ngRedux.dispatch(this._folderActions.loadFolder(this.issue, this.location));
    }

    /**
     * Переход к каталогу. Инициирует загрузку соответствующего каталога.
     * @param location
     */
    changeLocation(location: string) {
        this.location = location;
        this._ngRedux.dispatch(this._folderActions.loadFolder(this.issue, this.location));
    }

    /**
     * Сворачивает и разворачивает версии материала. При необходимости инициирует загрузку версий.
     * @param material
     */
    toggleVersions(material: IMaterialRef) {
        // скрываем версии
        if (this.materialExpanded && this.materialExpanded.id === material.id) {
            this.materialExpanded = null;
        } else {
            // показываем версии
            this.materialExpanded = material;

            // загружаем версии материала только при условии, что текущая версия > 1
            // и среди загруженных версий материала присутствует только одна (последняя) версия
            if (this._ngRedux.getState().materialVersions.filter(v => v.id === material.id).length === 1) {
                this._ngRedux.dispatch(this._materialVersionActions.loadMaterialVersions(material));
            }
        }
    }

    /**
     * Выбор типа материала. В случае смены типа инициирует соответствующий экшн.
     */
    setMaterialType(material: IMaterial, type: MaterialType) {
        if (material.type !== type) {
            this._ngRedux.dispatch(this._issueMaterialActions.changeMaterialType(this.issue, material, type));
        }
    }

    /**
     * Добавляет версию материала.
     */
    addVersion(material: IMaterialRef, files: File[]) {
        // TODO: здоровенные костыли, нужно избавиться
        // загрузка файлов этим способом идёт в обход архитектуры
        // вместо использования эпиков и стейта здесь происходит прямое обращение к апи

        // это загружаемая версия файла
        const versionUploading = {
            material: material, // материал, к которому догружается версия
            upload: {
                file: files[0], // загружаемый файл
                progress: 0 // прогресс загрузки
            }
        };

        this.versionsUploading.push(versionUploading); // добавляем загрузку в список, чтобы показать её в интерфейсе

        // загружаем файл в качестве версии к материалу
        this._uploadService.upload(`${this._appConfig.api.baseUrl}/api/web/materials/${material.id}/versions`, files[0],
            e => { // callback изменения прогресса загрузки

                // обновляем прогресс
                versionUploading.upload.progress = Math.floor(e.loaded * 100 / e.total);

                try { // вручную запускаем цикл обновления UI
                    this._changeDetectorRef.detectChanges();
                } catch (error) {
                    this._ngRedux.dispatch(this._errorActions.errorOccurred(error));
                }
            })
            .then(response => { // завершение загрузки

                // удаляем загруженную версию из списка загрузок
                const index = this.versionsUploading.indexOf(versionUploading);
                this.versionsUploading.splice(index, 1);

                // mapping'и не используются намеренно, чтобы не добавлять зависимость на классы маппинга здесь
                // т.к. это опять же идёт вразрез с архитектурой
                const versionUploaded: IMaterialVersion = {
                    id: material.id,
                    num: response.num,
                    fileName: response.fileName,
                    createdAt: new Date(response.createdAt),
                    createdBy: {
                        id: response.createdBy.id
                    }
                };

                const createdBy: IPerson = {
                    id: response.createdBy.id,
                    firstName: response.createdBy.info.firstName,
                    lastName: response.createdBy.info.lastName,
                    middleName: response.createdBy.info.middleName,
                    pictureUrl: response.createdBy.info.pictureUrl
                };

                // проталкиваем загруженный файл в стейт
                this._ngRedux.dispatch(this._materialVersionActions.loadMaterialVersionsComplete([versionUploaded]));
                this._ngRedux.dispatch(this._personActions.loadPersonsComplete([createdBy]));

                // опять же требуется вручную обновить интерфейс, иначе загрузка всё ещё будет отображаться
                this._changeDetectorRef.detectChanges();
            })
            .catch(error => {
                this._ngRedux.dispatch(this._errorActions.errorOccurred(error));
            });
    }

    /**
     * Добавляет материалы.
     * @param files
     */
    addMaterials(files: File[]) {

        const location = this.location;

        for (let file of files) {

            const materialUploading = {
                location: this.location,
                upload: {
                    file: file,
                    progress: 0
                }
            };

            this.materialsUploading.push(materialUploading); // добавляем загрузку в список, чтобы показать её в интерфейсе

            this._uploadService.upload(`${this._appConfig.api.baseUrl}/api/web/issues/${this.issue.id}/materials?location=${location}`,
                file,
                e => { // callback изменения прогресса загрузки

                    // обновляем прогресс
                    materialUploading.upload.progress = Math.floor(e.loaded * 100 / e.total);

                    try { // вручную запускаем цикл обновления UI
                        this._changeDetectorRef.detectChanges(); // TODO: загружаемые материалы почему-то не отображаются, разобраться
                    } catch (error) {
                        this._ngRedux.dispatch(this._errorActions.errorOccurred(error));
                    }
                })
                .then(response => { // завершение загрузки

                    // удаляем загруженную версию из списка загрузок
                    const index = this.materialsUploading.indexOf(materialUploading);
                    this.materialsUploading.splice(index, 1);

                    // mapping'и не используются намеренно, чтобы не добавлять зависимость на классы маппинга здесь
                    // т.к. это опять же идёт вразрез с архитектурой
                    const materialsUploaded: Array<{ self: IIssueMaterial, currentVersion: IMaterialVersion, createdBy: IPerson }> =
                        response.map(dto => {
                            return {
                                self: {
                                    id: dto.id,
                                    issue: {
                                        id: this.issue.id
                                    },
                                    currentVersion: {
                                        id: dto.id,
                                        num: dto.currentVersion.num
                                    },
                                    type: dto.type,
                                    location: dto.location + '\\'
                                },
                                currentVersion: {
                                    id: dto.id,
                                    num: dto.currentVersion.num,
                                    fileName: dto.currentVersion.fileName,
                                    createdAt: new Date(dto.currentVersion.createdAt),
                                    createdBy: {
                                        id: dto.currentVersion.createdBy.id
                                    }
                                },
                                createdBy: {
                                    id: dto.currentVersion.createdBy.id,
                                    firstName: dto.currentVersion.createdBy.info.firstName,
                                    lastName: dto.currentVersion.createdBy.info.lastName,
                                    middleName: dto.currentVersion.createdBy.info.middleName,
                                    pictureUrl: dto.currentVersion.createdBy.info.pictureUrl
                                }
                            };
                        });

                    // если был загружен .zip-архив, он был распакован,
                    // нужно достать все каталоги
                    // не нужно руками ничего мёржить, всё сделает reducer каталогов, нужно просто передать ему список
                    const folders: Array<IIssueMaterialFolder> = materialsUploaded.map(x => x.self.location)
                        .filter(x => x !== '\\') // нам нужны все каталоги, кроме корневого
                        .reduce((result, current) => { // избавляемся от дубликатов
                            if (result.indexOf(current) === -1) {
                                result.push(current);
                            }
                            return result;
                        }, [])
                        .map(x => {
                            const segments = x.split('\\');
                            return {
                                issue: {
                                    id: this.issue.id
                                },
                                name: segments[segments.length - 2],
                                // location'ы заканчиваются на '\', например \folder\,
                                // соответственно нам нужен предпоследний элемент (folder)
                                location: x
                            };
                        });

                    // проталкиваем загруженные материалы в стейт
                    this._ngRedux.dispatch(this._materialVersionActions
                        .loadMaterialVersionsComplete(materialsUploaded.map(x => x.currentVersion)));
                    this._ngRedux.dispatch(this._issueMaterialActions.loadMaterialsComplete(materialsUploaded.map(x => x.self)));
                    this._ngRedux.dispatch(this._folderActions.loadFoldersComplete(folders));
                    this._ngRedux.dispatch(this._personActions.loadPersonsComplete(materialsUploaded.map(x => x.createdBy)));

                    // опять же требуется вручную обновить интерфейс, иначе загрузка всё ещё будет отображаться
                    this._changeDetectorRef.detectChanges();
                })
                .catch(error => {
                    this._ngRedux.dispatch(this._errorActions.errorOccurred(error));
                });
        }
    }

    /**
     * Удаляет материал.
     * @param material
     */
    deleteMaterial(material: IIssueMaterial) {
        if (confirm('Удалить материал?')) {
            this._ngRedux.dispatch(this._issueMaterialActions.deleteMaterial(material));
        }
    }

    hasPermission$(permission: PermissionEnum): Observable<boolean> {
        return this._ngRedux.select(this._permissionSelectors.issueHasPermision(permission, this.issue));
    }
}
