import {Component, Input, OnInit} from '@angular/core';
import {AgendaItemWorkflowAction} from '@app/store/agenda-item/agenda-item-workflow-action';

@Component({
    selector: 'senat-agenda-item-workflow-button',
    templateUrl: './agenda-item-workflow-button.component.html',
    styleUrls: ['./agenda-item-workflow-button.component.css']
})
export class AgendaItemWorkflowButtonComponent implements OnInit {


    agendaItemWorkflowActions = AgendaItemWorkflowAction;

    @Input()
    workflowAction: AgendaItemWorkflowAction;
    
    @Input()
    isGreenBackground = false;

    constructor() {
    }

    ngOnInit() {
    }
}
