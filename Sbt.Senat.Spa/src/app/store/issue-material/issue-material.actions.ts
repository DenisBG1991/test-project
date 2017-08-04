import {Injectable} from '@angular/core';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IIssueRef} from '@app/store/issue';
import {IMaterialRef} from '@app/store/material';
import {IssueMaterialType} from '@app/store/material/material-type.model';

@Injectable()
export class IssueMaterialActions {
    static readonly LoadMaterialsComplete = 'LOAD_ISSUE_MATERIALS_COMPLETE';
    static readonly LoadPresentations = 'LOAD_ISSUE_PRESENTATIONS';
    static readonly LoadDecisionProjects = 'LOAD_ISSUE_DECISION_PROJECTS';
    static readonly LoadVersions = 'LOAD_ISSUE_MATERIAL_VERSIONS';
    static readonly ChangeMaterialType = 'CHANGE_ISSUE_MATERIAL_TYPE';
    static readonly MaterialTypeChanged = 'ISSUE_MATERIAL_TYPE_CHANGED';
    static readonly DeleteMaterial = 'DELETE_ISSUE_MATERIAL';

    static readonly UploadIssueMaterial = 'UPLOAD_ISSUE_MATERIAL';


    loadMaterialsComplete(materials: Array<IIssueMaterial>) {
        return {
            type: IssueMaterialActions.LoadMaterialsComplete,
            payload: {
                materials: materials
            }
        };
    }

    loadPresentations(issue: IIssueRef) {
        return {
            type: IssueMaterialActions.LoadPresentations,
            payload: {
                issue: issue
            }
        };
    }

    loadDecisionProjects(issue: IIssueRef) {
        return {
            type: IssueMaterialActions.LoadDecisionProjects,
            payload: {
                issue: issue
            }
        };
    }

    /**
     * Смена типа материала.
     */
    changeMaterialType(material: IMaterialRef, type: IssueMaterialType) {
        return {
            type: IssueMaterialActions.ChangeMaterialType,
            payload: {
                material: material,
                type: type
            }
        };
    }

    /**
     * Тип материала изменён.
     */
    materialTypeChanged(material: IMaterialRef, type: IssueMaterialType) {
        return {
            type: IssueMaterialActions.MaterialTypeChanged,
            payload: {
                material: material,
                type: type
            }
        };
    }

    /**
     * Удаление материала.
     * @param material
     * @returns {{type: string, payload: {material: IIssueMaterial}}}
     */
    deleteMaterial(material: IMaterialRef, issue: IIssueRef) {
        return {
            type: IssueMaterialActions.DeleteMaterial,
            payload: {
                material: material,
                issue: issue
            }
        };
    }


    uploadIssueMaterial(issue: IIssueRef, location: string, file: File) {
        return {
            type: IssueMaterialActions.UploadIssueMaterial,
            payload: {
                issue: issue,
                location: location,
                file: file
            }
        };
    }


}
