import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenatDropdownComponent } from './senat-dropdown.component';

describe('SenatDropdownComponent', () => {
  let component: SenatDropdownComponent;
  let fixture: ComponentFixture<SenatDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenatDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenatDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
