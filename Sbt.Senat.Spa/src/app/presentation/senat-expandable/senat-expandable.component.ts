import {animate, Component, Input, OnInit, state, style, transition, trigger} from '@angular/core';
import {UUID} from 'angular2-uuid';

@Component({
    selector: 'senat-expandable',
    templateUrl: './senat-expandable.component.html',
    styleUrls: ['./senat-expandable.component.css']
})
export class SenatExpandableComponent implements OnInit {

    @Input()
    elemCount: number;
    @Input()
    title: string;
    @Input()
    expandFunc: () => void;
    @Input()
    collapseFunc: () => void;
    private readonly uniqueId: string;
    private isExpanded: boolean;

  constructor() {
      this.uniqueId = UUID.UUID();
      this.isExpanded = false;
  }

  ngOnInit() {
  }
  onFoldClick() {
      if (!this.isExpanded && this.expandFunc) {
          this.expandFunc();
      } else if (this.collapseFunc) {
          this.collapseFunc();
      }
      this.isExpanded = !this.isExpanded;
  }
}
