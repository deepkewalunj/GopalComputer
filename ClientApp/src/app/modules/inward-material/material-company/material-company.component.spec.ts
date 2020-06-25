import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialCompanyComponent } from './material-company.component';

describe('MaterialCompanyComponent', () => {
  let component: MaterialCompanyComponent;
  let fixture: ComponentFixture<MaterialCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
