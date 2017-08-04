import {IMeetingRef} from '@app/store/meeting/meeting-ref.model';
import {IMaterial} from '@app/store/material';
import {MeetingMaterialType} from '@app/store/material/material-type.model';

export interface IMeetingMaterial extends IMaterial {
    meeting: IMeetingRef;
    type: MeetingMaterialType;
}
