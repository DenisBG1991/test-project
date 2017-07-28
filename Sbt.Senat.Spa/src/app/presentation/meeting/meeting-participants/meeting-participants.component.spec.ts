import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingParticipantsComponent } from './meeting-participants.component';

describe('MeetingParticipantsComponent', () => {
  let component: MeetingParticipantsComponent;
  let fixture: ComponentFixture<MeetingParticipantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingParticipantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingParticipantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
