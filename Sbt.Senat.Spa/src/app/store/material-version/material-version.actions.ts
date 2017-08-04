import {Injectable} from '@angular/core';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IMaterialRef} from '@app/store/material';

@Injectable()
export class MaterialVersionActions {
    static readonly LoadMaterialVersionsComplete = 'LOAD_MATERIAL_VERSIONS_COMPLETE';
    static readonly LoadVersions = 'LOAD_MATERIAL_VERSIONS';
    static readonly UploadMaterialVersion = 'UPLOAD_MATERIAL_VERSION';
    static readonly IssueMaterialUploadProgress = 'MATERIAL_UPLOAD_PROGRESS';
    loadMaterialVersionsComplete(versions: Array<IMaterialVersion>) {
        return {
            type: MaterialVersionActions.LoadMaterialVersionsComplete,
            payload: {
                versions: versions
            }
        };
    }

    loadMaterialVersions(material: IMaterialRef) {
        return {
            type: MaterialVersionActions.LoadVersions,
            payload: {
                material: material
            }
        };
    }

    uploadMaterialVersion(material: IMaterialRef, file: File) {
        return {
            type: MaterialVersionActions.UploadMaterialVersion,
            payload: {
                material: material,
                file: file
            }
        };
    }

    materialUploadProgress(location: string, material: IMaterialRef, file: File, progress: number) {
        return {
            type: MaterialVersionActions.IssueMaterialUploadProgress,
            payload: {
                material: material,
                location: location,
                upload: {file: file, progress: progress}
            }
        };
    }
}
