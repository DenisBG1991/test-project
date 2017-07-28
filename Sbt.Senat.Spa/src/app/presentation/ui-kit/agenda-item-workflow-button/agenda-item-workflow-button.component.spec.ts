import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemWorkflowButtonComponent } from './agenda-item-workflow-button.component';

describe('AgendaItemWorkflowButtonComponent', () => {
  let component: AgendaItemWorkflowButtonComponent;
  let fixture: ComponentFixture<AgendaItemWorkflowButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemWorkflowButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemWorkflowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
