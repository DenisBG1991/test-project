import {AfterViewChecked, Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'senat-check-element',
    templateUrl: './check-element.component.html',
    styleUrls: ['./check-element.component.css']
})
export class CheckElementComponent implements OnInit, AfterViewChecked {

    @Input()
    checked = false;

     @Input()
    existed = true;

    constructor() {
    }

    ngOnInit() {
    }
    
    ngAfterViewChecked() {
         if (this.existed !== this.checked) {
        //     this.existed = this.checked;
             this.existed = this.existed;
        }
    }
}
