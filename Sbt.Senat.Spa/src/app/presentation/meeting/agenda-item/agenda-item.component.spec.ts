import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemComponent } from './agenda-item.component';

describe('AgendaItemComponent', () => {
  let component: AgendaItemComponent;
  let fixture: ComponentFixture<AgendaItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
