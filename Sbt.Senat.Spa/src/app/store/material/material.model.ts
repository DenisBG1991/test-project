import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {IssueMaterialType} from '@app/store/material/material-type.model';

export interface IMaterial extends IMaterialRef {
    id: string;
    location: string;
    currentVersion: IMaterialVersionRef;
}

export interface IMaterialRef {
    id: string;
}
