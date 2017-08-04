import {Directive, Input, ViewContainerRef, ComponentFactoryResolver, OnInit} from '@angular/core';
import {ValidationMessageComponent} from '@app/presentation/forms/validation/validation-message/validation-message.component';
import {FormGroup} from '@angular/forms';

@Directive({
    selector: '[senatValidation]'
})
export class ValidationDirective implements OnInit {

    @Input() formControlName = '';
    @Input() senatValidation: FormGroup;
    @Input() translations = '';

    constructor(private viewContainer: ViewContainerRef,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }

    ngOnInit() {
        this.viewContainer.clear();

        const validationMessageComponentFactory = this.componentFactoryResolver.resolveComponentFactory(ValidationMessageComponent);
        const validationMessageComponent = this.viewContainer.createComponent(validationMessageComponentFactory).instance;

        validationMessageComponent.formControlName = this.formControlName;
        validationMessageComponent.formGroup = this.senatValidation;
        validationMessageComponent.translationsKey = this.translations;
    }
}
