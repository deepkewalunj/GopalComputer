import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardReportComponent } from './outward-report.component';

describe('OutwardReportComponent', () => {
  let component: OutwardReportComponent;
  let fixture: ComponentFixture<OutwardReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
