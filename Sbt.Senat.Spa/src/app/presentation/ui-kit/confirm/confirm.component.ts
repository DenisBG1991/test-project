import {Component, OnInit, ViewChild} from '@angular/core';
import {PopupComponent} from '@app/presentation/ui-kit/popup/popup.component';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';
import {Subject} from 'rxjs/Subject';

@Component({
    selector: 'senat-confirm',
    templateUrl: './confirm.component.html',
    styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent implements OnInit {

    buttonType = ButtonType;
    @ViewChild(PopupComponent) popup: PopupComponent;

    confirmed: Subject<boolean> = new Subject();
    confirmed$ = this.confirmed.asObservable().share();

    confirmText: string;


    ngOnInit() {
        this.confirmed$.subscribe(r => {
            this.popup.hide();
        });
    }

    show(confirmText: string) {
        this.confirmText = confirmText;
        this.popup.show();
    }


}
