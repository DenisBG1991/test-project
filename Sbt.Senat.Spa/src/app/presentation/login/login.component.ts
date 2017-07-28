import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {ValidationService} from '@app/services/validation.service';
import {SessionActions} from '@app/store/session/session.actions';
import {Observable} from 'rxjs/Observable';
import {NgRedux} from '@angular-redux/store';
import {IAppState} from '@app/store/store';
import {Router} from '@angular/router';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {TextInputStyle} from '@app/presentation/ui-kit/text-input/text-input-style';

@Component({
    selector: 'senat-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    buttonType = ButtonType;
    inputStyle = TextInputStyle;

    formGroup: FormGroup;

    loginInProgress$: Observable<boolean> =
        this._ngRedux.select(x => x.layout.login.loginInProgress);

    loginFailed$: Observable<boolean> =
        this._ngRedux.select(x => !!x.layout.login.error);

    constructor(private _validationService: ValidationService,
                private _sessionActions: SessionActions,
                private _ngRedux: NgRedux<IAppState>) {
    }

    ngOnInit() {
        this.formGroup = this._validationService.createFormGroup(new LoginModel(),
            [
                {
                    propExpression: m => m.username,
                    validators: [
                        Validators.required,
                        Validators.minLength(3)
                    ]
                },
                {
                    propExpression: m => m.password,
                    validators: [
                        Validators.required
                    ]
                }
            ]);
    }

    signIn() {
        const model = this.formGroup.value as LoginModel;

        this._ngRedux.dispatch(this._sessionActions.login(model.username, model.password, model.rememberMe));
    }

    showControlErrors(controlName: string): boolean {
        return this._validationService.showControlErrors(this.formGroup, controlName);
    }

    /*
     как пример получения ошибки для контрола
     private getControlErrorMessages(controlName: string): string[] {
     return this.validation.getControlErrorMessages(this.formGroup, controlName, this.translationsKey);
     }
     */
    getFormErrorMessages(): string[] {
        return this._validationService.getFormErrorMessages(this.formGroup);
    }
}

class LoginModel {
    username: string;
    password: string;
    rememberMe: boolean;

    constructor() {
        this.username = '';
        this.password = '';
        this.rememberMe = false;
    }
}
