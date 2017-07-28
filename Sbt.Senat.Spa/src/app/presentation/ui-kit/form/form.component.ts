import {Component, Input, OnInit} from '@angular/core';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {CloseButtonType} from '@app/presentation/ui-kit/button/close-button/close-button.component';
import {BackNavigationService} from '@app/services/back-navigation.service';


export enum TitleColor {
    Blue = <any>'blue',
    Green = <any>'green',
    Default = <any>'default'
}

@Component({
    selector: 'senat-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

    buttonType = ButtonType;

    closeButtonType = CloseButtonType;

    @Input()
    title: string;

    @Input()
    requiredFieldFormHeight = 300;

    @Input()
    titleColor = TitleColor.Default;

    @Input()
    footerButtonColor = ButtonType.Green;

    @Input()
    footerButtonTitle = 'Сохранить';

    @Input()
    footerButtonClickHandler: () => void;

    @Input()
    footerButtonDisabled = false;

    constructor(private _backNavigationService: BackNavigationService) {
    }

    ngOnInit() {
    }

    closeForm() {
        this._backNavigationService.navigateBack();
    }

    handleFooterClick() {
        this.footerButtonClickHandler();
    }

}
