import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AgendaItemParticipantsComponent} from './agenda-item-participants.component';

describe('AgendaItemParticipantsComponent', () => {
    let component: AgendaItemParticipantsComponent;
    let fixture: ComponentFixture<AgendaItemParticipantsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
                declarations: [AgendaItemParticipantsComponent]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AgendaItemParticipantsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
