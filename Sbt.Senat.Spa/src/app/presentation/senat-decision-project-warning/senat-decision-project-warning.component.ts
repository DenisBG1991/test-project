import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'senat-decision-project-warning',
  templateUrl: './senat-decision-project-warning.component.html',
  styleUrls: ['./senat-decision-project-warning.component.css']
})
export class SenatDecisionProjectWarningComponent implements OnInit {

    @Input()
    hasValidated: boolean;

    constructor() {
    }

    ngOnInit() {
    }

}
