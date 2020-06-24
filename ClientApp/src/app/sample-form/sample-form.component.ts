import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-sample-form',
  templateUrl: './sample-form.component.html'
})
export class SampleFormComponent implements OnInit {

  // we used reactive forms and validations

  @Input() account: Account;
  angForm: FormGroup;
  constructor(private fb: FormBuilder) {
   this.createForm();
  }

  createForm() { 
    this.angForm = this.fb.group({
      empName:      ['', Validators.required],
      tax:          ['', Validators.required],
      employerID:   ['', Validators.required],
      contactName:  ['', Validators.required],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactPhone: ['', Validators.required],
      zip:          ['', Validators.required],
      date:         ['', Validators.required],
      status:    ['', Validators.required],
      employerAddress: this.fb.array([
        this.employerAddressFormGroup()
      ])
    });
  }

 //  dynamic form control array  function

  employerAddressFormGroup(): FormGroup {
    return this.fb.group({
      addressLine1:  [''],
      addressLine2:  [''],
      city:  [''],
      state:  [''],
      zip:  [''],

    });
  }

 // add dynamic row btn function

  addEmployerClick(): void {
    (<FormArray>this.angForm.get('employerAddress')).push(this.employerAddressFormGroup());
  }

  // remove dynamic row btn function

  removeEmpAddressBtn(employerAddressGroupIndex: number): void {
    (<FormArray>this.angForm.get('employerAddress')).removeAt(employerAddressGroupIndex);
  }


  // multiselect dropdown code here
  
  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  ngOnInit(){
      this.dropdownList = [
        {"id":1,"itemName":"Active"},
        {"id":2,"itemName":"Inactive"},
        {"id":3,"itemName":"All"},
                          ];
      this.selectedItems = [
        {"id":2,"itemName":"Inactive"},
                          ];
      this.dropdownSettings = { 
        singleSelection: false, 
        text:"Status",
        selectAllText:'Select All',
        unSelectAllText:'UnSelect All',
        enableSearchFilter: true,
        classes:"multiselect"
      };            
  }

}
