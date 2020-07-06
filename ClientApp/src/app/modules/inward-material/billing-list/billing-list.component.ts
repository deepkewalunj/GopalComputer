import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bill } from 'src/app/models/Bill.model';
import { BillGenerationComponent } from '../bill-generation/bill-generation.component';
import { BillService } from 'src/app/services/bill.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonModel, DataTablesResponse } from 'src/app/models/common.model';

@Component({
  selector: 'app-billing-list',
  templateUrl: './billing-list.component.html',
  styleUrls: ['./billing-list.component.scss']
})
export class BillingListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  bills: Bill[];

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  dtTrigger: Subject<any> = new Subject();
  // we used reactive forms and validations
  addClientForm: FormGroup;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient,
    private billService: BillService) { }


  openDelete(content, bill: Bill) {

    const that = this;

    this.modalService.open(content).result.then((result) => {
      if (result == true) {


        that.deleteBill(bill, that);

      }

    }, (reason) => {

    });
  }

  addClientPopup(currentBill: Bill) {
    let localBill = currentBill;
    if (localBill == null) {
      localBill = new Bill();
    }

    const modalRef = this.modalService.open(BillGenerationComponent, { size: 'lg' });
    modalRef.componentInstance.bill = localBill;
    modalRef.componentInstance.modelRef = modalRef;
    modalRef.result.then((result) => {
      if (result == true) {
        this.successMessage = "Bill saved successfully.";
      }

    }, (reason) => {

    });
  }

  deleteBill(bill: Bill, that) {
    that.customerService.deleteBill(bill.billId).subscribe((data) => {
      that.rerender();
      that.successMessage = "Bill deleted successfully."
    }, (error) => {


    })
  }

  /*succes message code here*/

  ngOnInit(): void {



    const that = this;


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: false
    };
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }


  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  rerender(): void {
    debugger;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  
  public changeSuccessMessage() {
    this._success.next('Bill deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }
}
