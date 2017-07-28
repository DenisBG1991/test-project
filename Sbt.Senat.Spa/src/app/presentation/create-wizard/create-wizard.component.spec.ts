import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWizardComponent } from './create-wizard.component';

describe('CreateWizardComponent', () => {
  let component: CreateWizardComponent;
  let fixture: ComponentFixture<CreateWizardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWizardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
