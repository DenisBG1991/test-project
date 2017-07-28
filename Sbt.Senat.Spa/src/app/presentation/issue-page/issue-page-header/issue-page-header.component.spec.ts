import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePageHeaderComponent } from './issue-page-header.component';

describe('IssuePageHeaderComponent', () => {
  let component: IssuePageHeaderComponent;
  let fixture: ComponentFixture<IssuePageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuePageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
