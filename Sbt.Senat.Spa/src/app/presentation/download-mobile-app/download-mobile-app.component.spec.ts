import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadMobileAppComponent } from './download-mobile-app.component';

describe('DownloadMobileAppComponent', () => {
  let component: DownloadMobileAppComponent;
  let fixture: ComponentFixture<DownloadMobileAppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadMobileAppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadMobileAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
