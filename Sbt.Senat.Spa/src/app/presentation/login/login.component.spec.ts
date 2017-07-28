/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginTestModule } from './login.test.module';


describe('LoginComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [LoginTestModule]
        });

    });

    it('should create', async(() => {
        let fixture = TestBed.createComponent(LoginComponent);
        let app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
