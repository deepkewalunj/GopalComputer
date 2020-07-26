import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Lumpsum } from 'src/app/models/Lumpsum.model';
import { LumpsumGenerationComponent } from '../lumpsum-generation/lumpsum-generation.component';
import { LumpsumService } from 'src/app/services/lumpsum.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonModel, DataTablesResponse } from 'src/app/models/common.model';
import { LumpsumPrintComponent } from '../lumpsum-print/lumpsum-print.component';
import { SharedService } from '../../../shared/shared.service';
@Component({
  selector: 'app-lumpsum',
  templateUrl: './lumpsum.component.html',
  styleUrls: ['./lumpsum.component.scss']
})
export class LumpsumComponent implements AfterViewInit, OnDestroy, OnInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  lumpsums: Lumpsum[];

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

  dtTrigger: Subject<any> = new Subject();
  // we used reactive forms and validations
  addClientForm: FormGroup;
  constructor(private fb: FormBuilder, private modalService: NgbModal, private http: HttpClient,
    private lumpsumService: LumpsumService, config: NgbModalConfig, public sharedService: SharedService) {
    config.backdrop = 'static'; config.keyboard = false;
  }


  openDelete(content, lumpsum: Lumpsum) {

    const that = this;

    this.modalService.open(content).result.then((result) => {
      if (result == true) {


        that.deleteLumpsum(lumpsum, that);

      }

    }, (reason) => {

    });
  }

  addLumpsumPopup(currentLumpsum: Lumpsum) {
    let localLumpsum = currentLumpsum;
    if (localLumpsum == null) {
      localLumpsum = new Lumpsum();
    }
    const that = this;
    const modalRef = this.modalService.open(LumpsumGenerationComponent, { size: 'lg' });
    modalRef.componentInstance.lumpsum = localLumpsum;
    modalRef.componentInstance.modelRef = modalRef;
    modalRef.result.then((result) => {
      if (result == true) {
        this.successMessage = "Lumpsum saved successfully.";
        that.rerender();
      }

    }, (reason) => {

    });
  }

  deleteLumpsum(lumpsum: Lumpsum, that) {
    that.lumpsumService.deleteLumpsum(lumpsum.lumpsumId).subscribe((data) => {
      that.rerender();
      that.successMessage = "Lumpsum deleted successfully."
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
      ajax: (getLumpsumListModel: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.API_URL + "Payment/GetLumpsumList",
            { getListModel: getLumpsumListModel }, {}
          ).subscribe(resp => {
            that.lumpsums = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },order: [[ 4, "desc" ]],
      columns: [{ data: 'lumpsumId', searchable: true, orderable: true }, { data: 'lumpsumDate', searchable: true, orderable: true },
        { data: 'companyName', searchable: false, orderable: true }, { data: 'paidAmount', searchable: true, orderable: true },
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
    this._success.next('Lumsum deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }

  printLumpsum(lumpsumId) {
    if (lumpsumId > 0) {
      this.givePrint(lumpsumId);
    }
  }

  givePrint(lumpsumId) {
    this.lumpsumService.getLumpsumById(lumpsumId).subscribe(data => {
      this.openLumpsumPrintPopup(data);
    }, error => {

    });
  }

  openLumpsumPrintPopup(lumpsum) {
    const modalRef = this.modalService.open(LumpsumPrintComponent, { size: 'lg', windowClass: 'print-modal' });
    modalRef.componentInstance.lumpsum = lumpsum;
    modalRef.componentInstance.modelRef = modalRef;
    modalRef.result.then((result) => {
      if (result == true) {
        this._success.next("Print done.")
      }

    }, (reason) => {

    });
  }

}
