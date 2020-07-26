import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OutwardComponent } from '../outward/outward.component';
import { OutwardService } from 'src/app/services/Outward.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonModel, DataTablesResponse } from 'src/app/models/common.model';
import { Outward } from '../../../models/Outward.model';
import { OutwardPrintComponent } from '../outward-print/outward-print.component';
import { SharedService } from '../../../shared/shared.service';
@Component({
  selector: 'app-outward-list',
  templateUrl: './outward-list.component.html',
  styleUrls: ['./outward-list.component.scss']
})
export class OutwardListComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  outwards: Outward[];

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  dtTrigger: Subject<any> = new Subject();
  // we used reactive forms and validations
  addClientForm: FormGroup;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient,
    private outwardService: OutwardService, config: NgbModalConfig, public sharedService: SharedService) {
    config.backdrop = 'static'; config.keyboard = false;
  }


  openDelete(content, outward: Outward) {

    const that = this;

    this.modalService.open(content).result.then((result) => {
      if (result == true) {


        that.deleteOutward(outward, that);

      }

    }, (reason) => {

    });
  }

  addOutwardPopup(currentOutward: Outward) {
    let localOutward = currentOutward;
    if (localOutward == null) {
      localOutward = new Outward();
    }
    const that = this;
    const modalRef = this.modalService.open(OutwardComponent, { size: 'lg' });
    modalRef.componentInstance.outward = localOutward;
    modalRef.componentInstance.modelRef = modalRef;
    modalRef.result.then((result) => {
      if (result == true) {
        this.successMessage = "Outward saved successfully.";
        that.rerender();
      }

    }, (reason) => {

    });
  }

  deleteOutward(outward: Outward, that) {
    that.outwardService.deleteOutward(outward.outwardId).subscribe((data) => {
      that.rerender();
      that.successMessage = "Outward deleted successfully."
    }, (error) => {


    })
  }

  /*succes message code here*/

  ngOnInit(): void {
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      ajax: (getOutwardListModel: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.API_URL + "Outward/GetOutwardList",
            { getListModel: getOutwardListModel }, {}
          ).subscribe(resp => {
            that.outwards = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },order: [[ 5, "desc" ]],
      columns: [{ data: 'outwardId', searchable: true, orderable: true }, { data: 'outwardDate', searchable: true, orderable: true },
      { data: 'jobNumbers', searchable: true, orderable: true }, { data: 'customerName', searchable: false, orderable: true }, { data: 'serviceAmount', searchable: true, orderable: true },
      { data: null, searchable: false, orderable: false }]
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
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }


  public changeSuccessMessage() {
    this._success.next('Outward deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }

  printOutward(outwardId) {
    if (outwardId > 0) {
      this.givePrint(outwardId);
    }
  }

  givePrint(outwardId) {
    this.outwardService.getOutwardById(outwardId).subscribe(data => {
      this.openOutwardPrintPopup(data);
    }, error => {

    });
  }

  openOutwardPrintPopup(outward) {
    const modalRef = this.modalService.open(OutwardPrintComponent, { size: 'lg', windowClass: 'print-modal' });
    modalRef.componentInstance.outward = outward;
    modalRef.componentInstance.modelRef = modalRef;
    modalRef.result.then((result) => {
      if (result == true) {
        this._success.next("Print done.")
      }

    }, (reason) => {

    });
  }
}
