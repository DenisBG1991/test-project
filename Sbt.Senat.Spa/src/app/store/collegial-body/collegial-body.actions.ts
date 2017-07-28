import {Injectable} from '@angular/core';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';

@Injectable()
export class CollegialBodyActions {
    static readonly UpdateCollegialBodies = 'UPDATE_COLLEGIAL_BODIES';
    static readonly UpdateCollegialBodiesComplete = 'UPDATE_COLLEGIAL_BODIES_COMPLETE';
    static readonly UpdateCollegialBodiesFail = 'UPDATE_COLLEGIAL_BODIES_FAIL';

    updateCollegialBodies() {
        return {
            type: CollegialBodyActions.UpdateCollegialBodies
        };
    }

    updateCollegialBodiesComplete(collegialBodies: Array<ICollegialBody>) {
        return {
            type: CollegialBodyActions.UpdateCollegialBodiesComplete,
            payload: {
                collegialBodies: collegialBodies
            }
        };
    }

    updateCollegialBodiesFail(error) {
        return {
            type: CollegialBodyActions.UpdateCollegialBodiesFail,
            payload: {
                error: error
            }
        };
    }
}
