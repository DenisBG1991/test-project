import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenatExpandableComponent } from './senat-expandable.component';

describe('SenatExpandableComponent', () => {
  let component: SenatExpandableComponent;
  let fixture: ComponentFixture<SenatExpandableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenatExpandableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenatExpandableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
