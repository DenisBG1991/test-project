import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemPageContentComponent } from './agenda-item-page-content.component';

describe('AgendaItemPageContentComponent', () => {
  let component: AgendaItemPageContentComponent;
  let fixture: ComponentFixture<AgendaItemPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
