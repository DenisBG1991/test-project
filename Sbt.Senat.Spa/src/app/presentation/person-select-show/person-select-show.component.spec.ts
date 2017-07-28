import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonSelectShowComponent } from './person-select-show.component';

describe('PersonSelectShowComponent', () => {
  let component: PersonSelectShowComponent;
  let fixture: ComponentFixture<PersonSelectShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonSelectShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonSelectShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
