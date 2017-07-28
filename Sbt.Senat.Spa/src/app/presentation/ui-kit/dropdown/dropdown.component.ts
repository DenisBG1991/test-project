import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';

@Component({
    selector: 'senat-dropdown-base',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.css']
})
export class DropdownComponent implements OnInit, AfterViewInit {

    @Input()
    topInputOffset = 10;

    @Input()
    leftInputOffset = 0;

    /**
     * Флаг, что ширина выпадающего списка равна ширине контрола
     * @type {boolean}
     */
    @Input()
    isSyncWidth = false;


    @ViewChild('dropdown')
    dropdown: ElementRef;

    @ViewChild('input')
    input: ElementRef;

    expanded: boolean;

    // For properly use needs to set hidden property to true on dropdown for hiding dropdown transition to input after appearance
    protected isAutoRerender = true;

    constructor() {
    }

    ngOnInit() {
    }

    //noinspection JSUnusedGlobalSymbols
    @HostListener('document:click', ['$event'])
    onClick(event) {
        // подписан на click, сворачивает элемент при клике вне области текстового поля
        if (this.dropdown && !this.input.nativeElement.contains(event.target) && !this.dropdown.nativeElement.contains(event.target)) {
            this.hide();
        }
    }

    @HostListener('document:scroll', ['$event'])
    onScroll(event) {
        if (this.dropdown && !this.input.nativeElement.contains(event.target) && !this.dropdown.nativeElement.contains(event.target)) {
            this.hide();
        }
    }

    hide() {
        this.expanded = false;
    }

    // Needs for draw dropdown near related input-control
    // Recomend to bind top and left by using calculateCoordinateStyle, this method for
    // saving from forgoting using them
    private notifyChange() {
        if (this.expanded) {

            //  JS is single-thread event-loop based language. So, callback of setTimeout will be executed
            //  when event loop is clean. Dropdown at this moment is not initialized, it is undefined, than we wait one event-loop tick,
            //  which would be busy for updating view, than callback will be processed
            setTimeout(() => {
                this.dropdown.nativeElement.hidden = true;
                const {top, left, width} = this.calculateCoordinationStyle();
                this.dropdown.nativeElement.style.left = left;
                this.dropdown.nativeElement.style.top = top;
                if (this.isSyncWidth) {
                    this.dropdown.nativeElement.style.width = width;
                }
                this.dropdown.nativeElement.hidden = false;
            }, 1);
        }
    }

    private subscribeToAllParentsScroll() {
        // Like monkey-patching, we are traversing through all the parents and subscribe to all their scroll events
        let parent = this.input.nativeElement.parentElement;
        while (parent) {
            parent.addEventListener('scroll', () => this.hide());
            parent = parent.parentElement;
        }
    }

    ngAfterViewInit() {
        this.subscribeToAllParentsScroll();
    }

    // Needs for controls, where expanding depends on click Event
    changeDropdownState() {
        if (this.expanded) {
            this.hide();
        } else {
            this.expand();
        }
    }

    expand() {
        this.expanded = true;
        if (this.isAutoRerender) {
            this.notifyChange();
        }
    }

    calculateCoordinationStyle() {
        const rect = this.input.nativeElement.getBoundingClientRect();
        return {
            top: rect.bottom + this.topInputOffset + 'px',
            left: rect.left + this.leftInputOffset + 'px',
            width: this.isSyncWidth ? this.input.nativeElement.scrollWidth + 'px' : ''
        };
    }
}
