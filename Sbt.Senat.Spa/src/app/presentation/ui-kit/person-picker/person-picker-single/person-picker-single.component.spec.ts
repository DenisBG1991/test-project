import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPickerSingleComponent } from './person-picker-single.component';

describe('PersonPickerSingleComponent', () => {
  let component: PersonPickerSingleComponent;
  let fixture: ComponentFixture<PersonPickerSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPickerSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPickerSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
