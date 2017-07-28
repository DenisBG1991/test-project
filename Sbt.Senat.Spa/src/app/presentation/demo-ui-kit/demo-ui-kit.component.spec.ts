import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoUiKitComponent } from './demo-ui-kit.component';

describe('DemoUiKitComponent', () => {
  let component: DemoUiKitComponent;
  let fixture: ComponentFixture<DemoUiKitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoUiKitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoUiKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
