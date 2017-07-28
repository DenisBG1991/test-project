import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegialBodyPickerComponent } from './collegial-body-picker.component';

describe('CollegialBodyPickerComponent', () => {
  let component: CollegialBodyPickerComponent;
  let fixture: ComponentFixture<CollegialBodyPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollegialBodyPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollegialBodyPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
