import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnInit,
    Output
} from '@angular/core';
import {ILabel} from '@app/store/label';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {DropdownComponent} from '@app/presentation/ui-kit/dropdown/dropdown.component';

@Component({
    selector: 'senat-label-autocomplete',
    templateUrl: './label-autocomplete.component.html',
    styleUrls: ['./label-autocomplete.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LabelAutocompleteComponent),
            multi: true
        }
    ]
})
export class LabelAutocompleteComponent extends DropdownComponent implements OnInit, ControlValueAccessor {

    private _selected: Array<ILabel>;

    focused = false;

    @Input()
    get selected() {
        return this._selected;
    }

    set selected(value: Array<ILabel>) {
        if (value !== this._selected) {
            this._selected = value;

            this._onChange(value);
        }
    }

    @Input()
    suggestions: Array<ILabel> = [];

    private _query = '';

    @Input()
    get query() {
        return this._query;
    }

    set query(value: string) {
        if (value !== this._query) {
            this._query = value;
            this.queryChanged.emit(value);
        }
    }

    @Output()
    createLabel: EventEmitter<ILabel> = new EventEmitter<ILabel>();

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter<string>();

    @Input()
    disabled = false;

    @Input()
    canCreateNewLabel = false;

    private _onChange: (value: ILabel[]) => void = () => {};
    private _onTouched: () => void = () => {};

    constructor() {
        super();
    }

    ngOnInit() {
    }

    remove(label: ILabel) {
        const index = this.selected.indexOf(label);
        this.selected.splice(index, 1);
    }

    add(label: ILabel) {
        this.selected = this.selected.concat(label);
        this.query = '';
    }

    addNew() {
        const newLabel: ILabel = {
            id: null,
            name: this.query
        };

        this.createLabel.emit(newLabel);

        this.selected = this.selected.concat(newLabel);
        this.query = '';
        this.hide();
    }

    /**
     * Removes the last selected label on Backspace press.
     * @param event
     */
    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Backspace' && this.selected.length > 0 && this.query === '') {
            const itemToRemove = this.selected[this.selected.length - 1];

            this.remove(itemToRemove);
        }
    }

    /**
     * Creates a new label from query string on Enter press
     * and adds it to the selected.
     * @param event
     */
    onKeyUp(event: KeyboardEvent) {

        if (!this.expanded) {
            this.expand();
        }

        if (event.key === 'Enter' && !/^\s*$/.test(this.query)) { // tag can't be empty
            this.addNew();
            this.hide();
        }
    }

    onFocus() {
        this.focused = true;
    }

    onBlur() {
        this.focused = false;
        this._onTouched();
    }

    writeValue(value: ILabel[]): void {
        this.selected = value;
    }

    registerOnChange(fn: any): void {
        this._onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this._onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
