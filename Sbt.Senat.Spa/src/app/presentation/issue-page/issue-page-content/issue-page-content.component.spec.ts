import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuePageContentComponent } from './issue-page-content.component';

describe('IssueComponent', () => {
  let component: IssuePageContentComponent;
  let fixture: ComponentFixture<IssuePageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuePageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuePageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
