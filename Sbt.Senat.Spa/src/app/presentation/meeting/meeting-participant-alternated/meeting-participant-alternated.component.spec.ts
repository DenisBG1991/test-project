import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingParticipantAlternatedComponent } from './meeting-participant-alternated.component';

describe('MeetingParticipantAlternatedComponent', () => {
  let component: MeetingParticipantAlternatedComponent;
  let fixture: ComponentFixture<MeetingParticipantAlternatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingParticipantAlternatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingParticipantAlternatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
