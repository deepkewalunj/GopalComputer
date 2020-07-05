import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardListComponent } from './outward-list.component';

describe('OutwardListComponent', () => {
  let component: OutwardListComponent;
  let fixture: ComponentFixture<OutwardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutwardListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutwardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
