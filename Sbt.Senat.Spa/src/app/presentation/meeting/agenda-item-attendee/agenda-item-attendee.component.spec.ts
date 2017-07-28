import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemAttendeeComponent } from './agenda-item-attendee.component';

describe('AgendaItemAttendeeComponent', () => {
  let component: AgendaItemAttendeeComponent;
  let fixture: ComponentFixture<AgendaItemAttendeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemAttendeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemAttendeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
