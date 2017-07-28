import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VotingInfoComponent } from './voting-info.component';

describe('VotingInfoComponent', () => {
  let component: VotingInfoComponent;
  let fixture: ComponentFixture<VotingInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VotingInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotingInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
