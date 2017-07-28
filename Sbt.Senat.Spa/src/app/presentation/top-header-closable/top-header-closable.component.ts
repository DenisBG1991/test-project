import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'senat-top-header-closable',
    templateUrl: './top-header-closable.component.html',
    styleUrls: ['./top-header-closable.component.css']
})
export class TopHeaderClosableComponent implements OnInit {

    title: string;

    constructor(private _location: Location, private _activatedRoute: ActivatedRoute) {
        this.title = this._activatedRoute.snapshot.data.title;
    }

    ngOnInit() {
    }

    close() {
        this._location.back();
    }
}
