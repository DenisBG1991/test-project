import {Response} from '@angular/http';

export class FormValidationException extends Error {
    public errors: IValidationError[];

    constructor(errorResponse: Response) {
        super();

        this.errors = errorResponse.json().errors;
    }

}

export interface IValidationError {
    key: string;
    message: string;
}
