/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultilingualTextInputComponent } from './multilingual-text-input.component';
import { CommonTestModule } from '@test/common.test.module';


describe('MultilingualTextInputComponent', () => {
  let component: MultilingualTextInputComponent;
  let fixture: ComponentFixture<MultilingualTextInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [CommonTestModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultilingualTextInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
