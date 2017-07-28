import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'senat-file-select',
    templateUrl: './file-select.component.html',
    styleUrls: ['./file-select.component.css']
})
export class FileSelectComponent implements OnInit {

    @Input()
    placeholder: string;

    @Input()
    multiple = false;

    @Output()
    selectFiles: EventEmitter<Array<File>> = new EventEmitter();

    constructor() {
    }

    ngOnInit() {
    }
}
