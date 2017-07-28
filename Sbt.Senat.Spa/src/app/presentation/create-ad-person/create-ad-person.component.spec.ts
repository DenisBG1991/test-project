import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAdPersonComponent } from './create-ad-person.component';

describe('CreateAdPersonComponent', () => {
  let component: CreateAdPersonComponent;
  let fixture: ComponentFixture<CreateAdPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateAdPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateAdPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
