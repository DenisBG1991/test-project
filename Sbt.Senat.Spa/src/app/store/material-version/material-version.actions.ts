import {Injectable} from '@angular/core';
import {IMaterialVersion} from '@app/store/material-version/material-version.model';
import {IMaterialRef} from '@app/store/material';

@Injectable()
export class MaterialVersionActions {
    static readonly LoadMaterialVersionsComplete = 'LOAD_MATERIAL_VERSIONS_COMPLETE';
    static readonly LoadVersions = 'LOAD_MATERIAL_VERSIONS';

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
}
