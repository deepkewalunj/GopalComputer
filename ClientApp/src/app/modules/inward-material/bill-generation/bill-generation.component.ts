import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Bill } from '../../../models/Bill.model'
import { NgbModal, NgbDate, NgbCalendar, NgbPeriod } from '@ng-bootstrap/ng-bootstrap';
import { BillService } from '../../../services/bill.service';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { TypeAheadSelect, CommonModel, FilePoco, Guid } from 'src/app/models/common.model';
import { TypeAheadResponseModel, TypeAheadRequestModel } from 'src/app/models/typeahead.model';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment';
import { debounce } from 'rxjs-compat/operator/debounce';
@Component({
  selector: 'app-bill-generation',
  templateUrl: './bill-generation.component.html',
  styleUrls: ['./bill-generation.component.scss']
})
export class BillGenerationComponent implements OnInit {
  @ViewChild('inputJobNumbers', { static: false }) inputJobNumbers;
  modelRef: any;
  bill: Bill;

  APIURL = environment.API_URL;

  searching = false;
  searchFailed = false;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  formatter = (typeAhead: TypeAheadResponseModel) => typeAhead.searchValue;

  hideTag = true;
  tags = [];


  @Input()
  maxlength: number;

  @Input() account: Account;
  billGenerationForm: FormGroup;

  billId: number;

  // we used reactive forms and validations
  constructor(private fb: FormBuilder, private modalService: NgbModal,
    private billService: BillService, private typeAheadService: TypeAheadService,
    private route: ActivatedRoute, private router: Router,
    private ngbCalendar: NgbCalendar) {
    this.createForm();
  }

  createForm() {
    this.billGenerationForm = this.fb.group({
      billDate: ['', Validators.required],
      billId: [{ value: null, disabled: true }],
      enggName: ['', Validators.required],
      serviceAmount: [{ value: null, disabled: true }, Validators.required],
      advanceAmount: [{ value: null, disabled: true }, Validators.required],
      paidImmediatlyAmount: ['', Validators.required],
      outstandingAmount: [{ value: null, disabled: true }, Validators.required],
      paymentRecievedBy: [''],
      chequeNo: [''],
      chequeDate: ['']
    });
  }

  searchJobNumber = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => term.length < 2 ? [] :
        this.typeAheadService.GetTypeAheadList(1, term, 4)
          .pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap(() => this.searching = false)
    )


  selectedJobNumber(jobNumber) {
    jobNumber.preventDefault();
    var addRecord = false;
    var duplicate = false;
    for (var i = 0; i < this.bill.lstJobNumbers.length; i++) {
      if (this.bill.lstJobNumbers[i].clientRefId == jobNumber.item.clientRefId)
        addRecord = true;
      if (this.bill.lstJobNumbers[i].searchId == jobNumber.item.searchId)
        duplicate = true;
    }
    if (!this.bill.lstJobNumbers || (this.bill.lstJobNumbers && this.bill.lstJobNumbers.length == 0))
      addRecord = true;

    if (addRecord && !duplicate)
    {
      var _billId = 0;
      if (this.bill.billId) {
        _billId = this.bill.billId;
      }
      this.billService.checkBillIsGeneratedForJob(_billId, jobNumber.item.searchId).subscribe(data => {
        
        if (data == false) {
          this.bill.lstJobNumbers.push(jobNumber.item);
          this.inputJobNumbers.nativeElement.value = '';
          this.calculateAdvancedAmount();
          this.calculateAmounts();
          this.onKeyFromPaidImmidiatly();
        }
        else {
          alert(jobNumber.item.searchId + " job number's bill is already generated, please select valid job number");
          this.inputJobNumbers.nativeElement.value = '';
          this.calculateAdvancedAmount();
          this.calculateAmounts();
          this.onKeyFromPaidImmidiatly();
        }
      }, error => {

      });
      
    }
    else
    {
      if (duplicate)
      {
        alert(jobNumber.item.searchId + " job number is already selected, please select valid job number");
        this.inputJobNumbers.nativeElement.value = '';
        this.calculateAdvancedAmount();
        this.calculateAmounts();
        this.onKeyFromPaidImmidiatly();
      }
      else
      {
        alert(jobNumber.item.searchId + " job number is not belongs to customer, please select valid job number");
        this.inputJobNumbers.nativeElement.value = '';
        this.calculateAdvancedAmount();
        this.calculateAmounts();
        this.onKeyFromPaidImmidiatly();
      }
    }

    
  }

  calculateAdvancedAmount() {
    this.bill.advanceAmount = 0;
    for (var i = 0; i < this.bill.lstJobNumbers.length; i++) {
      if (this.bill.lstJobNumbers[i].advanceAmount > 0)
        this.bill.advanceAmount += this.bill.lstJobNumbers[i].advanceAmount;
    }
    this.bill.serviceAmount = 0;
    for (var i = 0; i < this.bill.lstJobNumbers.length; i++) {
      if (this.bill.lstJobNumbers[i].serviceAmount > 0)
        this.bill.serviceAmount += this.bill.lstJobNumbers[i].serviceAmount;
    }
  }

  deleteTag(item) {
    this.bill.lstJobNumbers.splice(this.bill.lstJobNumbers.indexOf(item), 1);
    this.calculateAdvancedAmount();
    this.inputJobNumbers.nativeElement.focus();
    this.calculateAmounts();
    this.onKeyFromPaidImmidiatly();
  }

  ngOnInit() {

    if (this.bill.billId > 0) {
      this.billId = this.bill.billId;
      this.getBillById(this.billId);
    }
    else {
      this.bill = new Bill();
      this.bill.lstJobNumbers = [];
      this.bill.testedOk = '2';
      this.bill.materialUsed = '2';
      this.bill.printStatus = '2';
      this.bill.materialAdded = '2';
      this.bill.smsSent = '2';
      this.bill.paymentMode = '1';
      
      this.bill.ngbBillDate = this.ngbCalendar.getToday();
      this.bill.ngbChequeDate = this.ngbCalendar.getToday();
    }

    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }


  getBillById(billId) {
    this.billService.getBillById(billId).subscribe(data => {
      this.bill = data;
    }, error => {

    });
  }


  close() {
    this.modelRef.close(false);
  }

  validateForm() {
    if (!this.bill.lstJobNumbers || (this.bill.lstJobNumbers && this.bill.lstJobNumbers.length <= 0)) {
      return false;
    }
    if (this.bill.paidImmediatlyAmount > 0) {
      if (this.bill.paymentMode == '2') {
        if (!this.bill.ngbChequeDate.year || !this.bill.chequeNo || !this.bill.paymentRecievedBy) {
          return false;
        }
      }
      else {
        if (this.bill.paymentMode == '1' && !this.bill.paymentRecievedBy) {
          return false;
        }
      }
    }
    
    return true;
  }

  saveBill() {
    const formData = new FormData();
    formData.append("bill", JSON.stringify(this.bill))
    this.billService.addEditBill(formData).subscribe((bill: Bill) => {
      this.modelRef.close(true);
    }, (error) => {
      console.log(error);

    });
  }

  onKey(event: any, index : number) { // without type info
    //this.values += event.target.value + ' | ';
    this.bill.lstJobNumbers[index].serviceAmount = parseInt(event.target.value);
    this.calculateAmounts();
  }
  calculateAmounts() {
    this.bill.serviceAmount = 0;
    for (var i = 0; i < this.bill.lstJobNumbers.length; i++) {
      if (this.bill.lstJobNumbers[i].serviceAmount > 0)
        this.bill.serviceAmount += this.bill.lstJobNumbers[i].serviceAmount;
    }
    this.bill.outstandingAmount = 0;
    this.bill.outstandingAmount = this.bill.serviceAmount - this.bill.advanceAmount;
    this.bill.paidImmediatlyAmount = 0;
  }

  onKeyFromPaidImmidiatly() { // without type info
    this.bill.outstandingAmount = this.bill.serviceAmount - (this.bill.advanceAmount + this.bill.paidImmediatlyAmount);
  }
}
