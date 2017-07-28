import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuLayoutComponent } from './admin-menu-layout.component';

describe('AdminMenuLayoutComponent', () => {
  let component: AdminMenuLayoutComponent;
  let fixture: ComponentFixture<AdminMenuLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminMenuLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
