import {
    ComponentFactoryResolver, Injectable,
    ComponentRef,
    Injector, ApplicationRef, EmbeddedViewRef, ViewRef
} from '@angular/core';
import {ConfirmComponent} from '@app/presentation/ui-kit/confirm/confirm.component';
@Injectable()
export class ConfirmService {

    private _hostDomElement: HTMLElement | null = null;
    private _confirmComponent: ConfirmComponent;
    private _viewRef: ViewRef;
    private accept?: () => void;
    private reject?: () => void;
    private _atached = false;

    constructor(private _injector: Injector,
                private _componentFactoryResolver: ComponentFactoryResolver,
                private _appRef: ApplicationRef) {

        this._hostDomElement = document.createElement('div');
        document.body.appendChild(this._hostDomElement);
        const factory = this._componentFactoryResolver.resolveComponentFactory(ConfirmComponent);
        const componentRef = factory.create(this._injector);
        this._viewRef = componentRef.hostView;
        this._hostDomElement.appendChild(this._getComponentRootNode(componentRef));
        this._confirmComponent = componentRef.instance;
        this._confirmComponent.confirmed$.subscribe(r => {
            if (r && !!this.accept) {
                this.accept();
            } else if (!!this.reject) {
                this.reject();
            }
        });
    }


    private _getComponentRootNode(componentRef: ComponentRef<any>): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    }


    confirm(confirmText: string, accept?: () => void, reject?: () => void) {
        if (!this._atached) {
            this._atached = true;
            this._appRef.attachView(this._viewRef);
        }
        
        this._confirmComponent.show(confirmText);
        this.accept = accept;
        this.reject = reject;
    }

}
