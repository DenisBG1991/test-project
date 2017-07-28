import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

@Component({
    selector: 'senat-navigate-back',
    templateUrl: './navigate-back.component.html',
    styleUrls: ['./navigate-back.component.css']
})
export class NavigateBackComponent implements OnInit {

    constructor(private _location: Location) {
    }

    ngOnInit() {
    }

    back() {
        this._location.back();
    }
}
