import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemPageHeaderComponent } from './agenda-item-page-header.component';

describe('AgendaItemPageHeaderComponent', () => {
  let component: AgendaItemPageHeaderComponent;
  let fixture: ComponentFixture<AgendaItemPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
