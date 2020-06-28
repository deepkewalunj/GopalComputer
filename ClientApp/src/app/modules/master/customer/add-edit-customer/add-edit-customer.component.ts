import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Customer} from '../../../../models/customer.model'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {CustomerService} from '../../../../services/customer.service';
import { CommonModel } from 'src/app/models/common.model';


@Component({
  selector: 'app-add-edit-customer',
  templateUrl: './add-edit-customer.component.html',
  styleUrls: ['./add-edit-customer.component.scss']
})
export class AddEditCustomerComponent implements OnInit {

  // we used reactive forms and validations
  modelRef:any;
  customer: Customer;
  addClientForm: FormGroup;
  titles= CommonModel.getTitles();
  constructor(private fb: FormBuilder,private modalService: NgbModal,
              private customerService:CustomerService) {
   this.createForm();
  }




  createForm() {
    this.addClientForm = this.fb.group({
      title:      ['', Validators.required],
      customerName: ['', Validators.required],
      companyName:          ['', Validators.required],
      mobileNo: ['', Validators.required],
      clientAddress: ['', Validators.required],
      mobileNoFirst1:['' ],
      telNoFirst1:[''],
      telNoSecond2:['']
    });
  }
  ngOnInit(){}

  close(){
      this.modelRef.close(false);
  }

  saveCustomer(){
      this.customerService.addEditCustomer(this.customer).subscribe((customer:Customer)=>{
          this.customer=customer;
          this.modelRef.close(true);
      },(error)=>{
          console.log(error);

      });
  }
}
