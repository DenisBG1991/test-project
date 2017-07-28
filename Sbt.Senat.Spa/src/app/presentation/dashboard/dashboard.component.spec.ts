/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DashboardTestModule } from './dashboard.test.module';


describe('DashboardComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DashboardTestModule],
            declarations: [

            ]

        });
    });

    it('should create', async(() => {
        let fixture = TestBed.createComponent(DashboardComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});


