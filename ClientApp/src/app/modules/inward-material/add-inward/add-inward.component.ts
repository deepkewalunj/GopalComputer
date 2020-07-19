import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subject,of} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, map, tap, switchMap} from 'rxjs/operators';

import { Inward } from 'src/app/models/inward.model';
import { TypeAheadSelect, CommonModel, FilePoco, Guid } from 'src/app/models/common.model';
import { AddEditCustomerComponent } from '../../master/customer/add-edit-customer/add-edit-customer.component';
import { Customer } from 'src/app/models/customer.model';
import { TypeAheadResponseModel, TypeAheadRequestModel } from 'src/app/models/typeahead.model';
import { InwardService } from 'src/app/services/inward.service';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment';
import {WebcamImage} from 'ngx-webcam';
import { InwardPrintComponent } from '../inward-print/inward-print.component';
import { QzTrayService } from 'src/app/services/qz-tray.service';

@Component({
  selector: 'app-add-inward',
  templateUrl: './add-inward.component.html',
  styleUrls: ['./add-inward.component.scss']
})
export class AddInwardComponent implements OnInit {


  @ViewChild('inputAccessories',{static: false}) inputAccessories;

  APIURL=environment.API_URL;
  public modelNumber: any;
  public moreCompanyName: any;
  public materiaType: any;

  searching = false;
  searchFailed = false;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  isBarCodePrinting=false;

  formatter = (typeAhead: TypeAheadResponseModel) => typeAhead.searchValue;

  hideTag = true;
  tags = [];


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
    private route: ActivatedRoute,private router:Router,
    private ngbCalendar: NgbCalendar,private printService: QzTrayService) {
   this.createForm();
  }

  createForm() {
    this.addInwardForm = this.fb.group({
      inwardDate:   ['', Validators.required],
      customerName:  ['', Validators.required],
      modelNumber:['', Validators.required],
      materialType:['',Validators.required],
      companyName:['',Validators.required],
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
      this.inward.outwardBillStatus='2';
      this.inward.printStatus='2';
      this.inward.repeatJob='2';
      this.inward.smsStatus='1';
      this.inward.isProblemDetected='2';
      this.inward.isRepaired='2';
      this.inward.isOutwardOrBillExist=false;

      this.inward.ngbInwardDate=this.ngbCalendar.getToday();
      this.inward.ngbDeliveryDate=this.ngbCalendar.getNext(this.inward.ngbInwardDate,'d',4);
      this.inward.inwardFiles=[];
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
      if(!this.inward.inwardFiles)
      {
        this.inward.inwardFiles=[];
      }
      this.inward.accessories="";

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
  this.inward.lstAccessories.push({
    searchId: 0,
    searchValue: selectedElementArray[1], splitValue: '', advanceAmount: 0, clientRefId: 0, modelNo: '', materialType: '', companyName: '', serialNo:'',isRepaired:2, serviceAmount:0
  });
}





selectedInventory(inventory){
  inventory.preventDefault();
  this.inward.lstAccessories.push(inventory.item);
  this.inputAccessories.nativeElement.value = '';
}

AddTag(){
  if( this.inputAccessories.nativeElement.value != '')
  {
    let responseModel=new TypeAheadResponseModel();
    responseModel.searchId=0;
    responseModel.searchValue=this.inputAccessories.nativeElement.value;
    responseModel.splitValue="";
    this.inward.lstAccessories.push(responseModel);
    this.inputAccessories.nativeElement.value = '';
    this.inputAccessories = "";
  }
}

deleteTag(item) {
    this.inward.lstAccessories.splice(this.inward.lstAccessories.indexOf(item), 1);
    this.inputAccessories.nativeElement.focus();
  }

  SaveInward(){

  const formData = new FormData();

    if (this.inward.inwardFiles.length>0)
    {
      for (let uploadFile of this.inward.inwardFiles)
      {
        if(uploadFile.file)
        {
          uploadFile.uniqueFilename=Guid.newGuid();
          formData.append(uploadFile.uniqueFilename, uploadFile.file);
        }
      }

    }
    formData.append("inward",JSON.stringify(this.inward) )

      this.inwardService.addEditInward(formData).subscribe(data=>{
      this.inward=data;
     this.GoToInwardById(this.inward.inwardId);
    },error=>{


    })
  }

GoToInwardList(){
    this.router.navigate(['inward-material/inward']);
}

GoToInwardById(inwardId:number)
{
  this.router.navigate(['inward-material/add-inward',inwardId]);
}

AddAdditional(){
  this.router.navigate(['inward-material/add-inward']);
  }

	onSelect(event) {
    for(let i=0;i<event.addedFiles.length;i++)
    {
      let uploadedFile:File=event.addedFiles[i];
      let filePocoObject=new FilePoco();
      filePocoObject.originalFilename=uploadedFile.name;
      filePocoObject.file=uploadedFile;
      this.inward.inwardFiles.push(filePocoObject);

    }



	}

	onRemove(event) {

		this.inward.inwardFiles.splice(this.inward.inwardFiles.indexOf(event), 1);
	}



  printInwardByZPL() {

    this.isBarCodePrinting=true;
    this.printService.printBarCodeData( this.inward.barCodePrinterName, this.inward.inwardBarCodeZPL).subscribe(data => {
      this.isBarCodePrinting = false;
      console.log(data);
    }, error => {
        this.isBarCodePrinting = false;
      console.log(error);
    });


  }

  openInwardPrintPopup(inward) {
    const modalRef = this.modalService.open(InwardPrintComponent, { size: 'lg', windowClass: 'print-modal' });
    modalRef.componentInstance.inward = inward;
    modalRef.componentInstance.modelRef = modalRef;
    modalRef.result.then((result) => {
      if (result == true) {
        this._success.next("Print done.")
      }

    }, (reason) => {

    });
  }
  PrintInward(){
    if (this.inward.inwardId > 0) {
      this.openInwardPrintPopup(this.inward);
    }
  }

  // latest snapshot
  public webcamImage: WebcamImage = null;

  handleImage(webcamImage: WebcamImage) {
    this.webcamImage = webcamImage;
const that=this;
//Usage example:
this.urltoFile(this.webcamImage.imageAsDataUrl,Guid.newGuid()+".jpeg",'text/plain')
.then(function(uploadedFile){

       let filePocoObject=new FilePoco();
      filePocoObject.originalFilename=uploadedFile.name;
      filePocoObject.file=uploadedFile;
      that.inward.inwardFiles.push(filePocoObject);

});

}
  //return a promise that resolves with a File instance
   urltoFile(url, filename, mimeType){
    return (fetch(url)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], filename,{type:mimeType});})
    );
}


}
