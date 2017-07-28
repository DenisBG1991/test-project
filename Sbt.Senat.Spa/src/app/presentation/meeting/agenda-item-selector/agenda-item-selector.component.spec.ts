import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemSelectorComponent } from './agenda-item-selector.component';

describe('AgendaItemSelectorComponent', () => {
  let component: AgendaItemSelectorComponent;
  let fixture: ComponentFixture<AgendaItemSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
