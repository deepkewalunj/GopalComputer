import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Lumpsum } from '../../../models/Lumpsum.model'
import { NgbModal, NgbDate, NgbCalendar, NgbPeriod } from '@ng-bootstrap/ng-bootstrap';
import { LumpsumService } from '../../../services/lumpsum.service';
import { Observable, Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router'
import { environment } from 'src/environments/environment';
import { debounce } from 'rxjs-compat/operator/debounce';
import { TypeAheadResponseModel } from 'src/app/models/typeahead.model';
import { TypeAheadService } from 'src/app/services/type-ahead.service';

@Component({
  selector: 'app-lumpsum-generation',
  templateUrl: './lumpsum-generation.component.html',
  styleUrls: ['./lumpsum-generation.component.scss']
})
export class LumpsumGenerationComponent implements OnInit {
  modelRef: any;
  lumpsum: Lumpsum;

  APIURL = environment.API_URL;

  searching = false;
  searchFailed = false;

  formatter = (typeAhead: TypeAheadResponseModel) => typeAhead.searchValue;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  @Input()
  maxlength: number;

  @Input() account: Account;
  lumpsumGenerationForm: FormGroup;

  lumpsumId: number;

  // we used reactive forms and validations
  constructor(private fb: FormBuilder, private modalService: NgbModal,
    private lumpsumService: LumpsumService,
    private route: ActivatedRoute, private router: Router,
    private ngbCalendar: NgbCalendar,
    private typeAheadService: TypeAheadService) {
    this.createForm();
  }

  createForm() {
    this.lumpsumGenerationForm = this.fb.group({
      lumpsumDate: ['', Validators.required],
      lumpsumId: [{ value: null, disabled: true }],
      totalBillAmount: [{ value: null, disabled: true }],
      totalOutwordAmount: [{ value: null, disabled: true }],
      totalAmountDue: [{ value: null, disabled: true }],
      totalPaidAmount: [{ value: null, disabled: true }],
      outstandingAmount: [{ value: null, disabled: true }],
      paidAmount: ['', Validators.required],
      paymentRecievedBy: [''],
      customerName: ['', Validators.required],
      chequeNo: [''],
      chequeDate: ['']
    });
  }

  

  ngOnInit() {
    if (this.lumpsum.lumpsumId > 0) {
      this.lumpsumId = this.lumpsum.lumpsumId;
      this.getLumpsumById(this.lumpsumId);
    }
    else {
      this.lumpsum = new Lumpsum();
      this.lumpsum.printStatus = '2';
      this.lumpsum.smsSent = '2';
      this.lumpsum.paymentMode = '1';
      this.lumpsum.ngbLumpsumDate = this.ngbCalendar.getToday();
      this.lumpsum.ngbChequeDate = this.ngbCalendar.getToday();
    }

    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }


  getLumpsumById(lumpsumId) {
    this.lumpsumService.getLumpsumById(lumpsumId).subscribe(data => {
      this.lumpsum = data;
      this.lumpsum.customerTypeAhead = {
        searchId: data.clientRefId,
        searchValue: data.customerName
      };
    }, error => {

    });
  }


  close() {
    this.modelRef.close(false);
  }

  validateForm() {
    debugger;
    if (this.lumpsum.paidAmount > 0) {
      if (this.lumpsum.paymentMode == '2') {
        if (!this.lumpsum.ngbChequeDate.year || !this.lumpsum.chequeNo || !this.lumpsum.paymentRecievedBy) {
          return false;
        }
      }
      else {
        if (this.lumpsum.paymentMode == '1' && !this.lumpsum.paymentRecievedBy) {
          return false;
        }
      }
    }

    return true;
  }

  saveLumpsum() {
    debugger;
    const formData = new FormData();
    formData.append("lumpsum", JSON.stringify(this.lumpsum))
    this.lumpsumService.addEditLumpsum(formData).subscribe((lumpsum: Lumpsum) => {
      this.modelRef.close(true);
    }, (error) => {
      console.log(error);

    });
  }


  searchCustomer = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => term.length < 2 ? [] :
        this.typeAheadService.GetTypeAheadList(1, term, 1)
          .pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap(() => this.searching = false)
    )


  companyNameSelected(selectedElement) {
    selectedElement.preventDefault();
    this.lumpsum.clientRefId = selectedElement.item.searchId;
    this.lumpsum.customerTypeAhead = {
      searchId: selectedElement.item.searchId,
      searchValue: selectedElement.item.searchValue 
    };
    this.getStatementAmount(this.lumpsum.clientRefId);
    
  }

  getStatementAmount(clientRefId) {
    this.lumpsumService.getStatementAmount(clientRefId).subscribe(data => {
      this.lumpsum.totalBillAmount = data.totalBillAmount;
      this.lumpsum.totalOutwordAmount = data.totalOutwordAmount;
      this.lumpsum.totalAmountDue = data.totalAmountDue;
      this.lumpsum.totalPaidAmount = data.totalPaidAmount;
      this.lumpsum.outstandingAmount = data.outstandingAmount;
      this.lumpsum.customerName = data.customerName;
    }, error => {

    });
  }
}
