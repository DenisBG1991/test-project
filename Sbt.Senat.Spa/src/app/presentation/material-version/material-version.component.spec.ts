import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialVersionComponent } from './material-version.component';

describe('MaterialVersionComponent', () => {
  let component: MaterialVersionComponent;
  let fixture: ComponentFixture<MaterialVersionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialVersionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
