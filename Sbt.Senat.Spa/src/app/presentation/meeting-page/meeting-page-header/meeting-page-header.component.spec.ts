import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MeetingPageHeaderComponent} from './meeting-page-header.component';

describe('MeetingPageHeaderComponent', () => {
  let component: MeetingPageHeaderComponent;
  let fixture: ComponentFixture<MeetingPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
