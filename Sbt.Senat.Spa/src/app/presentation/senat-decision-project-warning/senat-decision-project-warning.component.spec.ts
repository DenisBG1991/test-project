import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenatDecisionProjectWarningComponent } from './senat-decision-project-warning.component';

describe('SenatDecisionProjectWarningComponent', () => {
  let component: SenatDecisionProjectWarningComponent;
  let fixture: ComponentFixture<SenatDecisionProjectWarningComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenatDecisionProjectWarningComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenatDecisionProjectWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
