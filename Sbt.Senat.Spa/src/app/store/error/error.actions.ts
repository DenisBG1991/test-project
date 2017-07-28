import {Injectable} from '@angular/core';

@Injectable()
export class ErrorActions {

    static readonly ErrorOccurred = 'ERROR_OCCURRED';

    errorOccurred(error) {
        return {
            type: ErrorActions.ErrorOccurred,
            payload: {
                error: error
            }
        };
    }
}
