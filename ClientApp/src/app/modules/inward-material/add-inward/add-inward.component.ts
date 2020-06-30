import { Component, OnInit, Input } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, filter} from 'rxjs/operators';
import { Inward } from 'src/app/models/inward.model';
import { TypeAheadSelect } from 'src/app/models/common.model';
import { AddEditCustomerComponent } from '../../master/customer/add-edit-customer/add-edit-customer.component';
import { Customer } from 'src/app/models/customer.model';


const states: TypeAheadSelect[] = [
  {id: 0, name: 'Alabama'},
  {id: 1, name: 'Alaska'},
  {id: 2, name: 'American Samoa'},
  {id: 3, name: 'Arizona'},
  {id: 4, name: 'Arkansas'},
  {id: 5, name: 'California'},
  {id: 6, name: 'Colorado'},
  {id: 7, name: 'Connecticut'},
  {id: 8, name: 'Delaware'},
  {id: 9, name: 'District Of Columbia'},
  {id: 10, name: 'Federated States Of Micronesia'},
];

@Component({
  selector: 'app-add-inward',
  templateUrl: './add-inward.component.html',
  styleUrls: ['./add-inward.component.scss']
})
export class AddInwardComponent implements OnInit {

  public modelNumber: any;
  public moreCompanyName: any;
  public materiaType: any;
  public addAccessories: any;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  formatter = (customer: TypeAheadSelect) => customer.name;

  hideTag = true;
  tags = [];


    /*phone masking*/
    public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    /*phone validation*/
    @Input()
    maxlength: number;


  // we used reactive forms and validations

  @Input() account: Account;
  addInwardForm: FormGroup;

//add company form
  addCompanyForm: FormGroup;

//add material form
  addMaterialForm: FormGroup;

  inward:Inward;

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
   this.createForm();
  }

  createForm() {
    this.addInwardForm = this.fb.group({
      inwardDate:   ['', Validators.required],
      customerName:  ['', Validators.required],
      modelNumber:['', Validators.required],
      materialType:['',Validators.required],
      companyName:['',Validators.required],
      barCode:  ['', Validators.required],
      serialNumber:['',Validators.required],
      ProblemDescription:['',Validators.required],
      EnggName:['',Validators.required],
      receiverName: ['', Validators.required],
      deliveryDate: ['', Validators.required],

    });





  }



  /*on click modal will be open*/
  open(content) {
    this.modalService.open(content);
  }



  addClientPopup(currentCustomer:Customer) {
    let localCustomer=currentCustomer;
    if(localCustomer==null)
    {
      localCustomer=new Customer();
      localCustomer.clientTitleId='';

    }
    const modalRef = this.modalService.open(AddEditCustomerComponent, { size: 'lg' });
    modalRef.componentInstance.customer=localCustomer;
    modalRef.componentInstance.modelRef=modalRef;
    modalRef.result.then((result) => {
      if(result==true)
      {
        this._success.next("Customer Added Successfully.");
      }

    }, (reason) => {

    });
  }


  addMaterialPopup(content) {
    this.modalService.open(content, { size: 'lg' });
  }



  // multiselect dropdown code here

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};

  ngOnInit(){
      this.inward=new Inward();
      setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  search = (text$: Observable<string>) => text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    map(term => states.filter(state => new RegExp(term, 'mi').test(state.name)).slice(0, 10))
  )

  // add-tags

  addTags(newTag: string) {
    if (newTag) {
      this.tags.push(newTag);
    }
  }
// delets-tags
  deleteTag(index) {
    this.tags.splice(index, 1);
  }


}
