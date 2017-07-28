/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IssuesListComponent } from './issue-list.component';
import { IssuesListTestModule } from './issue-list.test.module';


describe('IssuesListComponent', () => {
    let component: IssuesListComponent;
    let fixture: ComponentFixture<IssuesListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [IssuesListTestModule]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(IssuesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
