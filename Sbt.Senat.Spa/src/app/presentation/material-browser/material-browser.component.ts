import {Component, EventEmitter, Input, Output} from '@angular/core';

import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IPerson} from '@app/store/person/person.model';
import {IMaterialRef} from '@app/store/material/material.model';
import {IssueMaterialType} from '@app/store/material/material-type.model';
import {IMaterial} from '@app/store/material';
import {IMaterialFolder} from '@app/store/material/material-folder.model';
import {ConfirmService} from '@app/presentation/ui-kit/confirm/confirm.service';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IMeetingMaterial} from '@app/store/meeting-material/meeting-material.model';


@Component({
    selector: 'senat-material-browser',
    templateUrl: './material-browser.component.html',
    styleUrls: ['./material-browser.component.css']
    /*    changeDetection: ChangeDetectionStrategy.OnPush*/
})
export class MaterialBrowserComponent {


    /**
     * Текущий каталог.
     * @type {string}
     */
    location = '\\';
    /**
     * Материал, чьи версии развёрнуты.
     */
    materialExpanded: IMaterialRef;

    /**
     * Включение только на просмотр
     * @type {boolean}
     */
    @Input()
    disabled = false; // return this.hasPermission$(PermissionEnum.EditIssue);

    @Input()
    allowChangeType = true;

    @Input()
    allowManageMaterials = true;

    @Input()
    materials: Array<{ self: IMaterial, currentVersion: { self: IMaterialVersion, createdBy: IPerson } }> = [];

    @Input()
    folders: Array<IMaterialFolder> = [];

    @Input()
    versions: Array<{ self: IMaterialVersion, createdBy: IPerson }> = [];


    /**
     * Версии материалов, находящиеся в процессе загрузки.
     */
    @Input()
    versionsUploading: Array<{ material: IMaterialRef, upload: { file: File, progress: number } }> = [];

    /**
     * Материалы, находящиеся в процессе загрузки.
     */
    @Input()
    materialsUploading: Array<{ location: string, upload: { file: File, progress: number } }> = [];

    @Output()
    locationChanged: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    materialVersionExpanded: EventEmitter<IMaterialRef> = new EventEmitter<IMaterialRef>();


    @Output()
    materialTypeChanged: EventEmitter<{
        material: IMaterial,
        type: IssueMaterialType
    }> = new EventEmitter();


    @Output()
    materialDeleted: EventEmitter<IMaterialRef> = new EventEmitter();

    @Output()
    versionsAdded: EventEmitter<{
        material: IMaterialRef,
        files: File[]
    }> = new EventEmitter();

    @Output()
    materialsAdded: EventEmitter<{
        location: string,
        files: File[]
    }> = new EventEmitter();


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

    constructor(private _confirmServie: ConfirmService) {
    }

    /**
     * Переход к каталогу. Инициирует загрузку соответствующего каталога.
     * @param location
     */
    changeLocation(location: string) {
        this.location = location;
        this.locationChanged.emit(location)
    }

    /**
     * Сворачивает и разворачивает версии материала. При необходимости инициирует загрузку версий.
     * @param material
     */
    toggleVersions(material: IMaterial) {
        this.versions = [];
        // скрываем версии
        if (this.materialExpanded && this.materialExpanded.id === material.id) {
            this.materialExpanded = null;
        } else {
            // показываем версии
            this.materialExpanded = material;
            this.materialVersionExpanded.emit(material)
        }
    }

    /**
     * Выбор типа материала. В случае смены типа инициирует соответствующий экшн.
     */
    setMaterialType(material: IMaterial, type: IssueMaterialType) {
        const issueMaterial = material as IIssueMaterial;
        if (issueMaterial && issueMaterial.type) {
            this.materialTypeChanged.emit({
                material: material,
                type: type
            })
            return;
        }
        if (material['type'] !== type) {
            this.materialTypeChanged.emit({
                material: material,
                type: type
            })
        }
    }

    /**
     * Добавляет версию материала.
     */
    addVersion(material: IMaterialRef, files: File[]) {

        this.versionsAdded.emit({
            material: material,
            files: files
        });
    }

    /**
     * Добавляет материалы.
     * @param files
     */
    addMaterials(files: File[]) {
        this.materialsAdded.emit({
            location: this.location,
            files: files
        })
    }

    /**
     * Удаляет материал.
     * @param material
     */
    deleteMaterial(material: IMaterialRef) {
        this._confirmServie.confirm('Удалить материал?', () => {
            this.materialDeleted.emit(material);
        });
    }

    getMaterialType(material: IMaterial) {
        const issueMaterial = material as IIssueMaterial;
        if (issueMaterial && issueMaterial.type) {
            return issueMaterial.type
        }
        const meetingMaterial = material as IMeetingMaterial;
        if (meetingMaterial && meetingMaterial.type) {
            return meetingMaterial.type
        }
        if ('type' in material) {
            return material['type'];
        }
        return null;
    }
}
