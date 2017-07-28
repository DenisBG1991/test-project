import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPicker1Component } from './person-picker-1.component';

describe('PersonPicker1Component', () => {
  let component: PersonPicker1Component;
  let fixture: ComponentFixture<PersonPicker1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonPicker1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonPicker1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
