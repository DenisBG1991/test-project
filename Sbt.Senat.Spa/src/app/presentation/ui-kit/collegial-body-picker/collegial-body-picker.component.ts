import {Component, Input, forwardRef, EventEmitter, Output} from '@angular/core';
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from '@angular/forms';
import {DropdownComponent} from '../dropdown/dropdown.component';
import {ICollegialBody} from '@app/store/collegial-body/collegial-body.model';

@Component({
    selector: 'senat-collegial-body-picker',
    templateUrl: './collegial-body-picker.component.html',
    styleUrls: ['./collegial-body-picker.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => CollegialBodyPickerComponent),
        multi: true
    }]
})
export class CollegialBodyPickerComponent extends DropdownComponent implements ControlValueAccessor {


    disabled = false;
    selectedItem: ICollegialBody = null;

    @Input()
    placeholder = 'комитет';

    @Input()
    items: Array<ICollegialBody>;

    @Input()
    defaultValue: string;

    @Output()
    queryChanged: EventEmitter<string> = new EventEmitter();

    private _onChange: (value: ICollegialBody) => void = () => {
    };
    private _onTouched: () => void = () => {
    };

    constructor() {
        super();
        this.isSyncWidth = true;
        this.topInputOffset = 0;
    }


    select(item: ICollegialBody) {
        if (this.disabled) {
            return;
        }
        this.selectedItem = item;
        this._onChange(item);
        super.hide();
    }

    toggleSuggestions() {
        if (this.disabled) {
            return;
        }
        if (this.expanded) {
            this.hide();
        } else {
            this.expand();
        }
        this._onTouched();
    }

    onKeyUp(value: string, event) {
        if (!!this.selectedItem && !this.disabled) {
            this.selectedItem = null;
            this._onChange(null);
        }

        this.queryChanged.emit(value);
        if (!this.expanded) {
            this.expand();
        }
    }

    writeValue(obj: ICollegialBody): void {
        this.selectedItem = obj;
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
