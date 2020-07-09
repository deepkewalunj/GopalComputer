import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Outward } from '../../../models/Outward.model'
import { NgbModal, NgbDate, NgbCalendar, NgbPeriod } from '@ng-bootstrap/ng-bootstrap';
import { OutwardService } from '../../../services/Outward.service';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { TypeAheadSelect, CommonModel, FilePoco, Guid } from 'src/app/models/common.model';
import { TypeAheadResponseModel, TypeAheadRequestModel } from 'src/app/models/typeahead.model';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment';
import { debounce } from 'rxjs-compat/operator/debounce';
@Component({
  selector: 'app-outward-generation',
  templateUrl: './outward.component.html',
  styleUrls: ['./outward.component.scss']
})
export class OutwardComponent implements OnInit {
  @ViewChild('inputJobNumbers', { static: false }) inputJobNumbers;
  modelRef: any;
  outward: Outward;

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
  outwardForm: FormGroup;

  outwardId: number;

  // we used reactive forms and validations
  constructor(private fb: FormBuilder, private modalService: NgbModal,
    private outwardService: OutwardService, private typeAheadService: TypeAheadService,
    private route: ActivatedRoute, private router: Router,
    private ngbCalendar: NgbCalendar) {
    this.createForm();
  }

  createForm() {
    this.outwardForm = this.fb.group({
      outwardDate: ['', Validators.required],
      outwardId: [{ value: null, disabled: true }],
      enggName: ['', Validators.required],
      serviceAmount: [{ value: null, disabled: true }, Validators.required],
      advanceAmount: [{ value: null, disabled: true }, Validators.required],
      paidImmediatlyAmount: ['', Validators.required],
      outstandingAmount: [{ value: null, disabled: true }, Validators.required],
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
    var addRecord = false;
    var duplicate = false;
    for (var i = 0; i < this.outward.lstJobNumbers.length; i++) {
      if (this.outward.lstJobNumbers[i].clientRefId == jobNumber.item.clientRefId)
        addRecord = true;
      if (this.outward.lstJobNumbers[i].searchId == jobNumber.item.searchId)
        duplicate = true;
    }
    if (!this.outward.lstJobNumbers || (this.outward.lstJobNumbers && this.outward.lstJobNumbers.length == 0))
      addRecord = true;

    if (addRecord && !duplicate) {
      var _outwardId = 0;
      if (this.outward.outwardId) {
        _outwardId = this.outward.outwardId;
      }
      this.outwardService.checkOutwardIsGeneratedForJob(_outwardId, jobNumber.item.searchId).subscribe(data => {

        if (data == false) {
          this.outward.lstJobNumbers.push(jobNumber.item);
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
    else {
      if (duplicate) {
        alert(jobNumber.item.searchId + " job number is already selected, please select valid job number");
        this.inputJobNumbers.nativeElement.value = '';
        this.calculateAdvancedAmount();
        this.calculateAmounts();
        this.onKeyFromPaidImmidiatly();
      }
      else {
        alert(jobNumber.item.searchId + " job number is not belongs to customer, please select valid job number");
        this.inputJobNumbers.nativeElement.value = '';
        this.calculateAdvancedAmount();
        this.calculateAmounts();
        this.onKeyFromPaidImmidiatly();
      }
    }


  }

  calculateAdvancedAmount() {
    this.outward.advanceAmount = 0;
    for (var i = 0; i < this.outward.lstJobNumbers.length; i++) {
      if (this.outward.lstJobNumbers[i].advanceAmount > 0)
        this.outward.advanceAmount += this.outward.lstJobNumbers[i].advanceAmount;
    }
    this.outward.serviceAmount = 0;
    for (var i = 0; i < this.outward.lstJobNumbers.length; i++) {
      if (this.outward.lstJobNumbers[i].serviceAmount > 0)
        this.outward.serviceAmount += this.outward.lstJobNumbers[i].serviceAmount;
    }
  }

  deleteTag(item) {
    this.outward.lstJobNumbers.splice(this.outward.lstJobNumbers.indexOf(item), 1);
    this.calculateAdvancedAmount();
    this.inputJobNumbers.nativeElement.focus();
    this.calculateAmounts();
    this.onKeyFromPaidImmidiatly();
  }

  ngOnInit() {

    if (this.outward.outwardId > 0) {
      this.outwardId = this.outward.outwardId;
      this.getOutwardById(this.outwardId);
    }
    else {
      this.outward = new Outward();
      this.outward.lstJobNumbers = [];
      this.outward.testedOk = '2';
      this.outward.materialUsed = '2';
      this.outward.printStatus = '2';
      this.outward.materialAdded = '2';
      this.outward.smsSent = '2';
      this.outward.paymentMode = '1';

      this.outward.ngbOutwardDate = this.ngbCalendar.getToday();
      this.outward.ngbChequeDate = this.ngbCalendar.getToday();
    }

    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }


  getOutwardById(outwardId) {
    this.outwardService.getOutwardById(outwardId).subscribe(data => {
      this.outward = data;
    }, error => {

    });
  }


  close() {
    this.modelRef.close(false);
  }

  validateForm() {
    if (!this.outward.lstJobNumbers || (this.outward.lstJobNumbers && this.outward.lstJobNumbers.length <= 0)) {
      return false;
    }
    if (this.outward.paymentMode == '2') {
      if (!this.outward.ngbChequeDate.year || !this.outward.chequeNo || !this.outward.paymentRecievedBy) {
        return false;
      }
    }
    else {
      if (!this.outward.paymentRecievedBy) {
        return false;
      }
    }
    return true;
  }

  saveOutward() {
    debugger;
    const formData = new FormData();
    formData.append("outward", JSON.stringify(this.outward))
    this.outwardService.addEditOutward(formData).subscribe((outward: Outward) => {
      this.modelRef.close(true);
    }, (error) => {
      console.log(error);

    });
  }

  onKey(event: any, index: number) { // without type info
    //this.values += event.target.value + ' | ';
    this.outward.lstJobNumbers[index].serviceAmount = parseInt(event.target.value);
    this.calculateAmounts();
  }
  calculateAmounts() {
    this.outward.serviceAmount = 0;
    for (var i = 0; i < this.outward.lstJobNumbers.length; i++) {
      if (this.outward.lstJobNumbers[i].serviceAmount > 0)
        this.outward.serviceAmount += this.outward.lstJobNumbers[i].serviceAmount;
    }
    this.outward.outstandingAmount = 0;
    this.outward.outstandingAmount = this.outward.serviceAmount - this.outward.advanceAmount;
    this.outward.paidImmediatlyAmount = 0;
  }

  onKeyFromPaidImmidiatly() { // without type info
    this.outward.outstandingAmount = this.outward.serviceAmount - (this.outward.advanceAmount + this.outward.paidImmediatlyAmount);
  }
}
