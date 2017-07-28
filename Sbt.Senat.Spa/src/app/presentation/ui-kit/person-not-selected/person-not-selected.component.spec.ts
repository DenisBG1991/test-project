import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonNotSelectedComponent } from './person-not-selected.component';

describe('PersonNotSelectedComponent', () => {
  let component: PersonNotSelectedComponent;
  let fixture: ComponentFixture<PersonNotSelectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonNotSelectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonNotSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
