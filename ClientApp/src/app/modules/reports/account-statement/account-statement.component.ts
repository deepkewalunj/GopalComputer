import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar, NgbPeriod } from '@ng-bootstrap/ng-bootstrap';
import { ReportModel, ReportSearchModel } from 'src/app/models/Report.model';
import { Subject, Observable, of } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { TypeAheadResponseModel } from 'src/app/models/typeahead.model';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { ReportService } from 'src/app/services/report.service';
import { FiscalYear } from 'src/app/models/FiscalYear.model';
import { environment } from '../../../../environments/environment';
import { QzTrayService } from '../../../services/qz-tray.service';

@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.scss']
})
export class AccountStatementComponent implements OnInit {
  searchFilter: boolean;
  searchForm: FormGroup;
  accountStatement: any;
  searchModel: ReportSearchModel;
  formatter = (typeAhead: TypeAheadResponseModel) => typeAhead.searchValue;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: {};
  @ViewChild(DataTableDirective, { static: false })
  dtElement: DataTableDirective;
  todaydate: NgbDate;
  searching = false;
  searchFailed = false;
  isShow = false;
  isError = false;
  isAcStatementPrinting: boolean = false;
  maxDate = {};
  constructor(private ngbCalendar: NgbCalendar,
    private reportService: ReportService,
    private typeAheadService: TypeAheadService, private printService: QzTrayService) {
    this.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };}

  ngOnInit() {
    const that = this;
    this.todaydate = this.ngbCalendar.getToday();
    this.clearFilter();
    this.searchModel.reportFromDate = new NgbDate(FiscalYear.getFiscalStartYearByToday(this.todaydate), 4, 1)
    this.searchModel.reportToDate = this.todaydate;
    
  }


  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  clearFilter() {
    this.searchModel = { reportId: '', customerName: null, reportFromDate: null, reportToDate: null };
    this.isShow = false;
    this.isError = false;
  }

  GetAccountStatementReport() {
    if (this.searchModel.customerName && this.searchModel.reportFromDate && this.searchModel.reportToDate) {
      
      const that = this;
      this.reportService.GetAccountStatementReport(this.searchModel).subscribe(data => {
        that.isShow = true;
        that.isError = false;
        that.accountStatement = data;
      }, error => {
        console.log(error);
      })
    }
    else {
      this.searchModel.customerName = null;
      this.isError = true;
      this.isShow = false;
    }
  }

    /*on click search filter hide show on mobile*/

    toggleSearch() {
      this.searchFilter = !this.searchFilter;
    }
  
  searchCustomer = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term => term.length < 2 ? [] :
        this.typeAheadService.GetTypeAheadList(1, term, 5)
          .pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
      ),
      tap(() => this.searching = false)
    )

  toDataUrl(url, that, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function () {
      var reader = new FileReader();
      reader.onloadend = function () {
        callback(reader.result);
      }
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url + "?" + "id=" + that.searchModel.customerName.searchId + "&fd=" + that.searchModel.reportFromDate.day + "&fm=" + that.searchModel.reportFromDate.month + "&fy=" + that.searchModel.reportFromDate.year + "&td=" + that.searchModel.reportToDate.day + "&tm=" + that.searchModel.reportToDate.month + "&ty=" + that.searchModel.reportToDate.year + "");
    xhr.responseType = 'blob';
    xhr.send();
    xhr.send();
  }

  getBase64EncodedImage() {
    if (this.searchModel.customerName && this.searchModel.reportFromDate && this.searchModel.reportToDate) {
      if (this.searchModel.reportToDate.before(this.searchModel.reportFromDate)) {
        alert("From date should be less than to date");
        return false;
      }
      const that = this;
      that.isAcStatementPrinting = true;
      that.toDataUrl(environment.API_URL + 'PDF/PrintAccountStatement', that, function (base64Image) {
        base64Image = base64Image.split(",")[1];
        that.printAcStatement(base64Image, that);

      });
    }
    else {
      this.searchModel.customerName = null;
      this.isError = true;
      this.isShow = false;
    }
  }
  printAcStatement(base64Data, that) {

    var printData = [
      {
        type: 'pixel',
        format: 'pdf',
        flavor: 'base64',
        data: base64Data

      }
    ];

    that.printService.printData(this.accountStatement.normalPrinterName, printData).subscribe(data => {
      that.isAcStatementPrinting = false;
      console.log(data);
    }, error => {
        that.isAcStatementPrinting = false;
      console.log(error);
    });

  }
}
