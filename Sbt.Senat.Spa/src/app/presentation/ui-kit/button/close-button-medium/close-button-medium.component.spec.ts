import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseButtonMediumComponent } from './close-button-medium.component';

describe('CloseButtonMediumComponent', () => {
  let component: CloseButtonMediumComponent;
  let fixture: ComponentFixture<CloseButtonMediumComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseButtonMediumComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseButtonMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
