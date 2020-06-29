import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateModelNoMaterialTypeComponent } from './add-update-model-no-material-type.component';

describe('AddUpdateModelNoMaterialTypeComponent', () => {
  let component: AddUpdateModelNoMaterialTypeComponent;
  let fixture: ComponentFixture<AddUpdateModelNoMaterialTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdateModelNoMaterialTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUpdateModelNoMaterialTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
