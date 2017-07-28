import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemProjectComponent } from './agenda-item-project.component';

describe('AgendaItemProjectComponent', () => {
  let component: AgendaItemProjectComponent;
  let fixture: ComponentFixture<AgendaItemProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
