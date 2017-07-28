import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelAutocompleteComponent } from './label-autocomplete.component';

describe('LabelAutocompleteComponent', () => {
  let component: LabelAutocompleteComponent;
  let fixture: ComponentFixture<LabelAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelAutocompleteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
