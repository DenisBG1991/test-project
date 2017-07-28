import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckElementComponent } from './check-element.component';

describe('CheckElementComponent', () => {
  let component: CheckElementComponent;
  let fixture: ComponentFixture<CheckElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
