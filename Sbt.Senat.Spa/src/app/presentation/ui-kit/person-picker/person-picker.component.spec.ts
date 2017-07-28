import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPickerComponent } from './person-picker.component';

describe('PersonPickerComponent', () => {
  let component: PersonPickerComponent;
  let fixture: ComponentFixture<PersonPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
