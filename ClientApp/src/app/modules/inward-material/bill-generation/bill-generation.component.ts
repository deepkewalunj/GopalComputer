import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';


@Component({
  selector: 'app-bill-generation',
  templateUrl: './bill-generation.component.html',
  styleUrls: ['./bill-generation.component.scss']
})
export class BillGenerationComponent implements OnInit {

  // we used reactive forms and validations

  @Input() account: Account;
  billGenerationForm: FormGroup;
  constructor(private fb: FormBuilder) {
   this.createForm();
  }

  createForm() { 
    this.billGenerationForm = this.fb.group({
      billDate:      ['', Validators.required],
    });
  }


  ngOnInit(){
        
  }

}
