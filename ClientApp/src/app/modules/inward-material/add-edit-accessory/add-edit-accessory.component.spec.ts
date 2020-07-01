import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAccessoryComponent } from './add-edit-accessory.component';

describe('AddEditAccessoryComponent', () => {
  let component: AddEditAccessoryComponent;
  let fixture: ComponentFixture<AddEditAccessoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditAccessoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditAccessoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
