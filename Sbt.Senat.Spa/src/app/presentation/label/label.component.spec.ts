/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsTestModule } from './label.test.module';

import { LabelsComponent } from './label.component';

describe('LabelsComponent', () => {
    let component: LabelsComponent;
    let fixture: ComponentFixture<LabelsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [LabelsTestModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LabelsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
