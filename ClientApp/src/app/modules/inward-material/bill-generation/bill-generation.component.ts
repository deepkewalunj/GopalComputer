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
      serviceAmount: ['', Validators.required],
      advanceAmount: ['', Validators.required],
      paidImmediatlyAmount: ['', Validators.required],
      outstandingAmount: ['', Validators.required],
      paymentRecievedBy: ['', Validators.required],
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
    this.bill.lstJobNumbers.push(jobNumber.item);
    this.inputJobNumbers.nativeElement.value = '';
    this.calculateAdvancedAmount();
  }

  calculateAdvancedAmount() {
    this.bill.advanceAmount = 0;
    for (var i = 0; i < this.bill.lstJobNumbers.length; i++) {
      if (this.bill.lstJobNumbers[i].advanceAmount > 0)
        this.bill.advanceAmount += this.bill.lstJobNumbers[i].advanceAmount;
    }
  }

  deleteTag(item) {
    this.bill.lstJobNumbers.splice(this.bill.lstJobNumbers.indexOf(item), 1);
    this.inputJobNumbers.nativeElement.focus();
    this.calculateAdvancedAmount();
  }

  ngOnInit() {

    this.route.params.subscribe(data => {
      this.billId = data.inwardId;
    });
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
    if (this.billId) {
      this.getBillById(this.billId);
    }
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }


  getBillById(billId) {
    this.billService.addEditBill(billId).subscribe(data => {
      this.bill = data;
    }, error => {

    });
  }

  close() {
    this.modelRef.close(false);
  }

  validateForm() {
    debugger;
    if (!this.bill.lstJobNumbers || (this.bill.lstJobNumbers && this.bill.lstJobNumbers.length <= 0)) {
      return false;
    }
    if (this.bill.paymentMode == '2') {
      if (!this.bill.ngbChequeDate.year || !this.bill.chequeNo || !this.bill.paymentRecievedBy) {
        return false;
      }
    }
    else
    {
      if (!this.bill.paymentRecievedBy) {
        return false;
      }
    }
    return true;
  }

  saveBill() {
    alert('saving........');
    this.billService.addEditBill(this.bill).subscribe((bill: Bill) => {
      this.bill = bill;
      this.modelRef.close(true);
    }, (error) => {
      console.log(error);

    });
  }

}
