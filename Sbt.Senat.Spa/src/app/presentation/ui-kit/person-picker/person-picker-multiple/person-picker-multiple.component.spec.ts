import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPickerMultipleComponent } from './person-picker-multiple.component';

describe('PersonPickerSingleComponent', () => {
  let component: PersonPickerMultipleComponent;
  let fixture: ComponentFixture<PersonPickerMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPickerMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPickerMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
