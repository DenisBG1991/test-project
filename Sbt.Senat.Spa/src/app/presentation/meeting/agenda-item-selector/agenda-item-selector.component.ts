import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {PopupComponent} from '@app/presentation/ui-kit/popup/popup.component';
import {IIssue} from '@app/store/issue';
import {ButtonType} from '@app/presentation/ui-kit/button/button.component';

@Component({
    selector: 'senat-agenda-item-selector',
    templateUrl: './agenda-item-selector.component.html',
    styleUrls: ['./agenda-item-selector.component.css']
})
export class AgendaItemSelectorComponent implements OnInit {

    buttonType = ButtonType;

    @ViewChild('popup')
    popup: PopupComponent;

    @Input()
    suggestionIssues: Array<IIssue>;

    query: string;

    @Output()
    confirmed: EventEmitter<Array<IIssue>> = new EventEmitter<Array<IIssue>>();
    
    // Needs only for time the popup is shown
    selected: Array<IIssue> = new Array<IIssue>();

    @Output()
    patternChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor() {
    }

    ngOnInit() {
    }

    show() {
        this.popup.show();
    }

    confirm() {
        this.confirmed.emit(this.selected);
        this.selected = [];
        this.popup.hide();
    }
    
    cancel() {
        this.selected = [];
        this.popup.hide();
    }

    private addIssue(issue: IIssue) {
        this.selected = [...this.selected, issue];
    }

    private removeIssue(index: number) {
        this.selected = [...this.selected.slice(0, index), ...this.selected.slice(index + 1)];
    }

    clickIssue(issue: IIssue) {
        const existedIssue = this.selected.find(x => x.id === issue.id);
        if (!existedIssue) {
            this.addIssue(issue);
        } else {
            const index = this.selected.indexOf(existedIssue);
            this.removeIssue(index);
        }
    }

    isSelected(issue: IIssue) {
        return this.selected.some(x => x.id === issue.id);
    }
}
