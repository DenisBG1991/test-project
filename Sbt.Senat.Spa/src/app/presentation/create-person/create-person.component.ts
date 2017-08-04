import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators} from '@angular/forms';
import {NgRedux} from '@angular-redux/store';
import {ValidationService} from '@app/services/validation.service';
import IAdminState from '@app/store/admin/store.model';
import {IMultilingualPerson} from '@app/store/admin/person/person.model';
import {PersonActions} from '@app/store/admin/person/person.actions';
import {interval} from 'rxjs/observable/interval';


@Component({
    selector: 'senat-create-person',
    templateUrl: './create-person.component.html',
    styleUrls: ['./create-person.component.css']
})
export class CreatePersonComponent implements OnInit {

    query = '';
    formGroup: FormGroup;


   constructor(private _validationService: ValidationService,
   private _personActions: PersonActions,
   private _ngRedux: NgRedux<IAdminState>) {
   }

   ngOnInit() {
   this.subscribeToForm();
   /*      this.formGroup = this._validationService.createFormGroup(new FormModel(),
   [
   {
   propExpression: x => x.lastName,
                    validators: [
                        this._validationService.requiredMultilingual()
                    ]
                },
                {
                    propExpression: x => x.firstName,
                    validators: [
                        this._validationService.requiredMultilingual()
                    ]
                },
                {
                    propExpression: x => x.middleName,
                    validators: [
                        this._validationService.requiredMultilingual()
                    ]
                }
            ]);*/
    }

    subscribeToForm() {
        this._ngRedux.select(x => x.layout.createPersonForm)
            .subscribe(form => {
                if (!form) {
                    this.formGroup = this._validationService.createFormGroup(new FormModel(),
                        [
                            {
                                propExpression: x => x.lastName,
                                validators: [
                                    this._validationService.requiredMultilingual()
                                ]
                            },
                            {
                                propExpression: x => x.firstName,
                                validators: [
                                    this._validationService.requiredMultilingual()
                                ]
                            },
                            {
                                propExpression: x => x.middleName,
                                validators: [
                                    this._validationService.requiredMultilingual()
                                ]
                            }
                        ]);
                } else {
                    this.formGroup = form;
                }

                this.formGroup.valueChanges
                    .debounce(() => interval(300))
                    .subscribe(() => {
                        this._ngRedux.dispatch(this._personActions.createPersonFormChanged(this.formGroup));
                    });
            });
    }

    submit() {

        this._ngRedux.dispatch(this._personActions.createPerson(this.formGroup));
        /*const fv = this.formGroup.value;

        const personModel: IMultilingualPerson = {
            id: null,
            lastName: fv.lastName,
            firstName: fv.firstName,
            middleName: fv.middleName,
            pictureUrl: null
        };

        this._ngRedux.dispatch(this._personActions.createPerson(personModel));*/
    }

}

class FormModel {
    lastName: { [key: string]: string } = null;
    firstName: { [key: string]: string } = null;
    middleName: { [key: string]: string } = null;
}

