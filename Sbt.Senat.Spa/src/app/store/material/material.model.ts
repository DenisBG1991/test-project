import {IMaterialVersionRef} from '@app/store/material-version/material-version.model';
import {MaterialType} from '@app/store/material/material-type.model';

export interface IMaterial extends IMaterialRef {
    id: string;
    location: string;
    type: MaterialType;
    currentVersion: IMaterialVersionRef;
}

export interface IMaterialRef {
    id: string;
}
