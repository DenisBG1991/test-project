import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ILabel} from '@app/store/label';
import {LabelService} from '@app/services/api/label.service';

@Component({
    selector: 'senat-labels',
    templateUrl: './label.component.html',
    styleUrls: ['./label.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => LabelsComponent),
            multi: true
        }
    ]
})
export class LabelsComponent implements OnInit, ControlValueAccessor {

    private _model: ILabel[];

    get model(): ILabel[] {
        return this._model;
    };

    set model(value: ILabel[]) {
        this._model = value;
        this.onChange(this._model);
    };

    suggestions: ILabel[] = [];

    @Input()
    doNotSaveNew = false;

    onChange = (_) => {
    }
    onTouched = () => {
    }

    constructor(private _service: LabelService) {
    }

    ngOnInit() {
    }

    search($event) {
        let query = $event.query;

        this.suggestions = [];

        this._service.findLabels(query)
            .forEach(labels => {
                this.suggestions = labels;
                // если в результатах поиска нет нужного тега, предлагаем создать новый
                if (!this.doNotSaveNew && !labels.find(x => x.name === query)) {
                    const newLabel: ILabel = {
                        id: null,
                        name: query
                    };
                    this.suggestions.push(newLabel); // путём добавления тега с id: null в список предложенных вариантов
                }
            });
    }

    onSelect(labelSelected: ILabel) {
        if (labelSelected.id == null) {
            this._service.createLabel(labelSelected.name)
                .forEach(label => labelSelected.id = label.id);
        }
    }

    writeValue(value: ILabel[]) {
        this._model = value || [];
    }

    registerOnChange(fn) {
        this.onChange = fn;
    }

    registerOnTouched(fn) {
        this.onTouched = fn;
    }
}
