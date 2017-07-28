import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {MeetingPageContentComponent} from './meeting-page-content.component';


describe('MeetingComponent', () => {
  let component: MeetingPageContentComponent;
  let fixture: ComponentFixture<MeetingPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
