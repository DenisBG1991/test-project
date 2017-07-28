import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
    selector: 'senat-drop-zone',
    templateUrl: './drop-zone.component.html',
    styleUrls: ['./drop-zone.component.css']
})
export class DropZoneComponent implements OnInit {

    @Output()
    selectFiles = new EventEmitter<File[]>();

    @Input()
    multiple = false;

    highlighted: boolean;

    ngOnInit() {

    }

    onDragEnter(e: any): void {
        e.stopPropagation();
        e.preventDefault();
    }

    onDragOver(e: any): void {
        e.stopPropagation();
        e.preventDefault();

        this.highlighted = true;
    }

    onDragLeave(): void {
        this.highlighted = false;
    }

    onDrop(event: any): void {
        event.stopPropagation();
        event.preventDefault();

        let files = event.dataTransfer.files;

        if (files.length > 0) {
            this.selectFiles.emit(files);
        }

        this.highlighted = false;
    }
}
