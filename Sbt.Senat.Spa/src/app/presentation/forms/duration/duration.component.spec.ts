/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationTestModule } from './duration.test.module';

import { DurationComponent } from './duration.component';


describe('DurationComponent', () => {
    let component: DurationComponent;
    let fixture: ComponentFixture<DurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [DurationTestModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DurationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
