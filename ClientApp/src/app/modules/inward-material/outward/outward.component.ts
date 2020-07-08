import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';


@Component({
  selector: 'app-outward',
  templateUrl: './outward.component.html',
  styleUrls: ['./outward.component.scss']
})
export class OutwardComponent implements OnInit {

  // we used reactive forms and validations

  @Input() account: Account;
  outwardForm: FormGroup;
  constructor(private fb: FormBuilder) {
   this.createForm();
  }

  createForm() { 
    this.outwardForm = this.fb.group({
      outwardDate:      ['', Validators.required],
    });
  }

  //close() {
  //  this.modelRef.close(false);
  //}

  ngOnInit(){
        
  }

}

