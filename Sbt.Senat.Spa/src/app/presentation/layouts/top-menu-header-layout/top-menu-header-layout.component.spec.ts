import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMenuHeaderLayoutComponent } from './top-menu-header-layout.component';

describe('TopMenuHeaderLayoutComponent', () => {
  let component: TopMenuHeaderLayoutComponent;
  let fixture: ComponentFixture<TopMenuHeaderLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMenuHeaderLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMenuHeaderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
