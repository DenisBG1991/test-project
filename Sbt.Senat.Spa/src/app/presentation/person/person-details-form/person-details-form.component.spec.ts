import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDetailsFormComponent } from './person-details-form.component';

describe('PersonDetailsFormComponent', () => {
  let component: PersonDetailsFormComponent;
  let fixture: ComponentFixture<PersonDetailsFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonDetailsFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
