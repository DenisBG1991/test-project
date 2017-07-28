import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IssueMaterialFolderActions} from '@app/store/issue-material-folder/issue-material-folder.actions';

export function issueMaterialFolderReducer(state: Array<IIssueMaterialFolder> = [], action) {
    switch (action.type) {
        case IssueMaterialFolderActions.LoadFoldersComplete:
            return state.filter(f => action.payload.folders
                .find(ff => ff.issue.id === f.issue.id && ff.location === f.location) == null)
                .concat(action.payload.folders);

        default:
            return state;
    }
}
