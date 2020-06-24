import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {

  // we used reactive forms and validations

  @Input() account: Account;
  addClientForm: FormGroup;
  constructor(private fb: FormBuilder) {
   this.createForm();
  }

  createForm() { 
    this.addClientForm = this.fb.group({
      title:      ['', Validators.required],
      personName: ['', Validators.required],
      companyName:          ['', Validators.required],
      phoneNo: ['', Validators.required],
      
    });
  }
  ngOnInit(){}
}
