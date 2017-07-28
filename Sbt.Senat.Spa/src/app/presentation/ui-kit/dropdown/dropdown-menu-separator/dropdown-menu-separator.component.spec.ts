import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownMenuSeparatorComponent } from './dropdown-menu-separator.component';

describe('DropdownMenuSeparatorComponent', () => {
  let component: DropdownMenuSeparatorComponent;
  let fixture: ComponentFixture<DropdownMenuSeparatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropdownMenuSeparatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownMenuSeparatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
