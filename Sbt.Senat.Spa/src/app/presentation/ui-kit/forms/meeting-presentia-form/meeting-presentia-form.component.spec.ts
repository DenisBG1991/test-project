import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingPresentiaFormComponent } from './meeting-presentia-form.component';

describe('MeetingPresentiaFormComponent', () => {
  let component: MeetingPresentiaFormComponent;
  let fixture: ComponentFixture<MeetingPresentiaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingPresentiaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPresentiaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
