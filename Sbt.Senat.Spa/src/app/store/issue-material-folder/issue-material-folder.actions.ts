import {Injectable} from '@angular/core';
import {IIssueRef} from '@app/store/issue';
import {IIssueMaterialFolder} from '@app/store/issue-material-folder/issue-material-folder.model';
import {IIssueMaterial} from '@app/store/issue-material/issue-material.model';

@Injectable()
export class IssueMaterialFolderActions {
    static readonly LoadFolder = 'LOAD_ISSUE_MATERIALS_FOLDER';
    static readonly LoadFoldersComplete = 'LOAD_ISSUE_MATERIAL_FOLDERS_COMPLETE';

    loadFolder(issue: IIssueRef, location: string) {
        return {
            type: IssueMaterialFolderActions.LoadFolder,
            payload: {
                issue: issue,
                location: location
            }
        };
    }

    loadFoldersComplete(folders: Array<IIssueMaterialFolder>) {
        return {
            type: IssueMaterialFolderActions.LoadFoldersComplete,
            payload: {
                folders: folders
            }
        };
    }
}
