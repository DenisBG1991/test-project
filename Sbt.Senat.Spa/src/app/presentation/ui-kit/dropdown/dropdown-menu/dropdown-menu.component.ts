import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'senat-dropdown-menu',
    templateUrl: './dropdown-menu.component.html',
    styleUrls: ['./dropdown-menu.component.css']
})
export class DropdownMenuComponent implements OnInit {

    @ViewChild('toggleButton')
    toggleButton: ElementRef;

    @ViewChild('menu')
    menu: ElementRef;

    @Input()
    dropdownOrientation: DropdownMenuOrientation = DropdownMenuOrientation.Auto;

    expanded: boolean;

    constructor() {
    }

    ngOnInit() {
    }

    //noinspection JSUnusedGlobalSymbols
    @HostListener('document:click', ['$event'])
    onClick(event) {
        // подписан на click, сворачивает элемент при клике вне области текстового поля
        if (this.menu && !this.toggleButton.nativeElement.contains(event.target) && !this.menu.nativeElement.contains(event.target)) {
            this.collapse();
        }
    }

    toggle() {
        if (this.expanded) {
            this.collapse();
        } else {
            this.expand();
        }
    }

    collapse() {
        this.expanded = false;
    }

    expand() {
        this.expanded = true;
    }

    getDropdownOrientation(): DropdownMenuOrientation {
        const toggleButtonPosition = this.toggleButton.nativeElement.getBoundingClientRect();
        const clientAreaCenter = {x: window.innerWidth / 2, y: window.innerHeight / 2};

        if (this.dropdownOrientation !== DropdownMenuOrientation.Auto) {
            return this.dropdownOrientation;
        }

        if (toggleButtonPosition.left >= clientAreaCenter.x) {
            return DropdownMenuOrientation.BottomLeft;

        } else {
            return DropdownMenuOrientation.BottomRight;
        }
    }
}

export enum DropdownMenuOrientation {
    Auto = <any>'auto',
    BottomLeft = <any>'bottom-left',
    BottomRight = <any>'bottom-right'
}
