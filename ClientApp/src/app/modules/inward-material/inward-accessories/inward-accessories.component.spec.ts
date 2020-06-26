import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardAccessoriesComponent } from './inward-accessories.component';

describe('InwardAccessoriesComponent', () => {
  let component: InwardAccessoriesComponent;
  let fixture: ComponentFixture<InwardAccessoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardAccessoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardAccessoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
