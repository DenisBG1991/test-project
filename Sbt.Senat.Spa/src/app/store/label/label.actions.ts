import {Injectable} from '@angular/core';
import {ILabel} from '@app/store/label';

@Injectable()
export class LabelActions {
    static readonly CreateLabel = 'CREATE_LABEL';
    static readonly CreateLabelFailed = 'CREATE_LABEL_FAILED';

    static readonly LoadLabels = 'LOAD_LABELS';
    static readonly LoadLabelsCompleted = 'LOAD_LABELS_COMPLETED';
    static readonly LoadLabelsFailed = 'LOAD_LABELS_FAILED';

    createLabel(labelName: string) {
        return {
            type: LabelActions.CreateLabel,
            payload: {
                labelName: labelName
            }
        };
    }

    createLabelFailed(error) {
        return {
            type: LabelActions.CreateLabelFailed,
            payload: {
                error: error
            }
        };
    }

    loadLabels(filter: string) {
        return {
            type: LabelActions.LoadLabels,
            payload: {
                filter: filter
            }
        };
    }

    loadLabelsCompleted(labels: ILabel[]) {
        return {
            type: LabelActions.LoadLabelsCompleted,
            payload: {
                labels: labels
            }
        };
    }

    loadLabelsFailed(error) {
        return {
            type: LabelActions.LoadLabelsFailed,
            payload: {
                error: error
            }
        };
    }
}
