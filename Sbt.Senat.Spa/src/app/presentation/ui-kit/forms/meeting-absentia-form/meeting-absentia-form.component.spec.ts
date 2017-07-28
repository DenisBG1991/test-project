import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAbsentiaFormComponent } from './meeting-absentia-form.component';

describe('MeetingAbsentiaFormComponent', () => {
  let component: MeetingAbsentiaFormComponent;
  let fixture: ComponentFixture<MeetingAbsentiaFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingAbsentiaFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAbsentiaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
