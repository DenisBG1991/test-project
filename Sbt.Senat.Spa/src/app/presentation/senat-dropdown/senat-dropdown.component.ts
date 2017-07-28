import {Component, OnInit, AfterViewInit, Input} from '@angular/core';
import {UUID} from 'angular2-uuid';

declare var $: any;
export enum AlignEnum {
    Left,
    Right
}
;

@Component({
    selector: 'senat-dropdown',
    templateUrl: './senat-dropdown.component.html',
    styleUrls: ['./senat-dropdown.component.css']
})
export class SenatDropdownComponent implements OnInit, AfterViewInit {

    private buttonClass: string;
    private readonly unExpandedClassState = 'fa fa-chevron-down mb-0';
    private readonly expandedClassState = 'fa fa-chevron-up mb-0';
    private readonly uniqueId: string;
    private menuWidth: number;

    @Input()
    menuAlign: AlignEnum;

    @Input()
    title: string;
    
    @Input()
    isFilterActive: boolean;

    private get menuAlignRight () {
        switch (this.menuAlign) {
            case AlignEnum.Left:
                return 'auto';
            case AlignEnum.Right:
                return '0';
            default:
                return 'auto';
        }
    }
    private get menuAlignLeft () {
        switch (this.menuAlign) {
            case AlignEnum.Left:
                return '0';
            case AlignEnum.Right:
                return 'auto';
            default:
                return '0';
        }
    }


    constructor() {
        this.buttonClass = this.unExpandedClassState;
        this.uniqueId = UUID.UUID();
        this.menuAlign = AlignEnum.Left;
    }

    ngOnInit() {
    }

    onClickInternal(event: MouseEvent) {
        event.stopPropagation();
    }


    ngAfterViewInit() {
        $(`#${this.uniqueId}`).on('shown.bs.dropdown', () => {
            this.buttonClass = this.expandedClassState;
        });

        $(`#${this.uniqueId}`).on('hidden.bs.dropdown', () => {
            this.buttonClass = this.unExpandedClassState;
        });
    }
}
