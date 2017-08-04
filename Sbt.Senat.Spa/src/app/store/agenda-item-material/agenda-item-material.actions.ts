import {Injectable} from '@angular/core';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';
import {IIssueRef} from '@app/store/issue';
import {IMaterialRef} from '@app/store/material';
import {IssueMaterialType} from '@app/store/material/material-type.model';
import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IAgendaItemIdRef} from '@app/store/agenda-item/agenda-item.model';
import {IAgendaItemMaterial} from '@app/store/agenda-item-material/agenda-item-material.model';

@Injectable()
export class AgendaItemMaterialActions {
    static readonly LoadMaterialsComplete = 'LOAD_AGENDA_ITEM_MATERIALS_COMPLETE';
    static readonly LoadPresentations = 'LOAD_AGENDA_ITEM_PRESENTATIONS';
    static readonly LoadDecisionProjects = 'LOAD_AGENDA_ITEM_DECISION_PROJECTS';
    static readonly LoadVersions = 'LOAD_AGENDA_ITEM_MATERIAL_VERSIONS';
    static readonly ChangeMaterialType = 'CHANGE_AGENDA_ITEM_MATERIAL_TYPE';
    static readonly MaterialTypeChanged = 'AGENDA_ITEM_MATERIAL_TYPE_CHANGED';
    static readonly DeleteMaterial = 'DELETE_AGENDA_ITEM_MATERIAL';

    static readonly UploadMaterial = 'UPLOAD_AGENDA_ITEM_MATERIAL';


    loadMaterialsComplete(materials: Array<IAgendaItemMaterial>) {
        return {
            type: AgendaItemMaterialActions.LoadMaterialsComplete,
            payload: {
                materials: materials
            }
        };
    }

    loadPresentations(agendaItem: IAgendaItemIdRef, issue: IIssueRef, meeting: IMeetingRef) {
        return {
            type: AgendaItemMaterialActions.LoadPresentations,
            payload: {
                agendaItem: agendaItem,
                issue: issue,
                meeting: meeting
            }
        };
    }

    loadDecisionProjects(agendaItem: IAgendaItemIdRef, issue: IIssueRef, meeting: IMeetingRef) {
        return {
            type: AgendaItemMaterialActions.LoadDecisionProjects,
            payload: {
                agendaItem: agendaItem,
                issue: issue,
                meeting: meeting
            }
        };
    }

    /**
     * Смена типа материала.
     */
    changeMaterialType(
                       material: IMaterialRef,
                       type: IssueMaterialType) {
        return {
            type: AgendaItemMaterialActions.ChangeMaterialType,
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
            type: AgendaItemMaterialActions.MaterialTypeChanged,
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
    deleteMaterial(material: IMaterialRef, agendaItem: IAgendaItemIdRef) {
        return {
            type: AgendaItemMaterialActions.DeleteMaterial,
            payload: {
                material: material,
                agendaItem: agendaItem
            }
        };
    }


    uploadMaterial(agendaItem: IAgendaItemIdRef, location: string, file: File) {
        return {
            type: AgendaItemMaterialActions.UploadMaterial,
            payload: {
                agendaItem: agendaItem,
                location: location,
                file: file
            }
        };
    }
}
