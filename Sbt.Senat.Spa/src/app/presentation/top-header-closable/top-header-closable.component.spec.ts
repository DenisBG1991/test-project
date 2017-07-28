import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopHeaderClosableComponent } from './top-header-closable.component';

describe('TopHeaderClosableComponent', () => {
  let component: TopHeaderClosableComponent;
  let fixture: ComponentFixture<TopHeaderClosableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopHeaderClosableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopHeaderClosableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
