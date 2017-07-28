import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaItemProjectsComponent } from './agenda-item-projects.component';

describe('AgendaItemProjectsComponent', () => {
  let component: AgendaItemProjectsComponent;
  let fixture: ComponentFixture<AgendaItemProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgendaItemProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaItemProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
