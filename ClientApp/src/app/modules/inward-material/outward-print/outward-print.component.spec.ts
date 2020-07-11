import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardPrintComponent } from './outward-print.component';

describe('OutwardPrintComponent', () => {
  let component: OutwardPrintComponent;
  let fixture: ComponentFixture<OutwardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
