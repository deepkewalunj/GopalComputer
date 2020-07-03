import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject,of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

import { Inward } from 'src/app/models/inward.model';
import { TypeAheadSelect, CommonModel } from 'src/app/models/common.model';
import { AddEditCustomerComponent } from '../../master/customer/add-edit-customer/add-edit-customer.component';
import { Customer } from 'src/app/models/customer.model';
import { TypeAheadResponseModel, TypeAheadRequestModel } from 'src/app/models/typeahead.model';
import { InwardService } from 'src/app/services/inward.service';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-add-inward',
  templateUrl: './add-inward.component.html',
  styleUrls: ['./add-inward.component.scss']
})
export class AddInwardComponent implements OnInit {


  @ViewChild('inputAccessories',{static: false}) inputAccessories;

  public modelNumber: any;
  public moreCompanyName: any;
  public materiaType: any;

  searching = false;
  searchFailed = false;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  formatter = (typeAhead: TypeAheadResponseModel) => typeAhead.searchValue;

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

  inwardId:number;



billStatuses=CommonModel.getInwardOutwardBillStatuses();
printStatuses=CommonModel.getInwardOutwardPrintStatuses();
repeatJobs=CommonModel.getInwardRepeatJobs();
smsStatuses=CommonModel.getInwardSmsStatuses();

  constructor(private fb: FormBuilder, private modalService: NgbModal,
    private inwardService:InwardService,private typeAheadService:TypeAheadService,
    private route: ActivatedRoute,private router:Router) {
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

    this.route.params.subscribe(data =>{
        this.inwardId=data.inwardId;
    });
      this.inward=new Inward();
      this.inward.lstAccessories=[];
      this.inward.outwardBillStatus='';
      this.inward.printStatus='';
      this.inward.repeatJob='';
      this.inward.smsStatus='';
      this.inward.isProblemDetected='2';
      this.inward.isRepaired='2';
      let today=new Date();
      let fourAheadToday=this.addDays( new Date(),4);
      this.inward.ngbInwardDate=new NgbDate(today.getFullYear(),today.getMonth(),today.getDate());
      this.inward.ngbDeliveryDate=new NgbDate(fourAheadToday.getFullYear(),fourAheadToday.getMonth(),fourAheadToday.getDate());

      if(this.inwardId)
      {
        this.getInwardById(this.inwardId);
      }
      setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}

getInwardById(inwardId)
{
  this.inwardService.getInward(inwardId).subscribe(data=>{

      this.inward=data;
  },error=>{

  });
}



  searchCustomer = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>term.length < 2 ? []:
        this.typeAheadService.GetTypeAheadList(1,term,1)
        .pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

    searchModel = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>term.length < 2 ? []:
        this.typeAheadService.GetTypeAheadList(1,term,2)
        .pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

    searchMaterialType = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>term.length < 2 ? []:
        this.typeAheadService.GetTypeAheadList(2,term,2)
        .pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )

    searchCompanyName = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>term.length < 2 ? []:
        this.typeAheadService.GetTypeAheadList(3,term,2)
        .pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )
    searchInventory = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>term.length < 2 ? []:
        this.typeAheadService.GetTypeAheadList(this.inward.materialTypeAhead,term,3)
        .pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )
materialTypeAheadSelected(selectedElement){
  selectedElement.preventDefault();
  let selectedElementArray=selectedElement.item.splitValue.split('|');
  this.inward.modelNoTypeAhead=null;
  this.inward.materialTypeAhead=null;
  this.inward.companyNameTypeAhead=null;

  this.inward.modelNoTypeAhead={searchId: selectedElement.item.searchId,
    searchValue:selectedElementArray[0],splitValue:selectedElement.item.splitValue};

  this.inward.materialTypeAhead={searchId: selectedElement.item.searchId,
    searchValue:selectedElementArray[1],splitValue:selectedElement.item.splitValue};

  this.inward.companyNameTypeAhead={searchId: selectedElement.item.searchId,
    searchValue:selectedElementArray[2],splitValue:selectedElement.item.splitValue};

  this.inward.lstAccessories=[];
  this.inward.lstAccessories.push({searchId: 0,
    searchValue:selectedElementArray[1],splitValue:''});
}





selectedInventory(inventory){
  inventory.preventDefault();
  this.inward.lstAccessories.push(inventory.item);
  this.inputAccessories.nativeElement.value = '';
}



deleteTag(item) {
    this.inward.lstAccessories.splice(this.inward.lstAccessories.indexOf(item), 1);
    this.inputAccessories.nativeElement.focus();
  }

  SaveInward(){
    this.inwardService.addEditInward(this.inward).subscribe(data=>{
      this.router.navigate(['inward-material/inward']);

    },error=>{


    })
  }



}
