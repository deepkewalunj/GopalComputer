import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from 'src/app/services/report.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject, Observable, of } from 'rxjs';
import { ReportModel, ReportSearchModel } from 'src/app/models/Report.model';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { TypeAheadResponseModel } from 'src/app/models/typeahead.model';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { FiscalYear } from 'src/app/models/FiscalYear.model';

@Component({
  selector: 'app-outward-report',
  templateUrl: './outward-report.component.html',
  styleUrls: ['./outward-report.component.scss']
})
export class OutwardReportComponent implements OnInit {

  searchFilter: boolean;
  searchForm: FormGroup;
  lstOutwardReport:ReportModel[];
  searchModel:ReportSearchModel;

  formatter = (typeAhead: TypeAheadResponseModel) => typeAhead.searchValue;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  servicetotal:number=0;
  advancetotal:number=0;
  paidtotal:number=0;
  outStandingtotal:number=0;
  todaydate:NgbDate;
  searching = false;
  searchFailed = false;
  inwardAddressPrint:string;
  inwardAddressPhoneNoPrint:string;
  maxDate = {};
  constructor(private ngbCalendar: NgbCalendar,
     private reportService:ReportService,
    private typeAheadService: TypeAheadService) {
    this.maxDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };}

  ngOnInit() {

    const that=this;
    this.todaydate=this.ngbCalendar.getToday();
    this.clearFilter();
   this.searchModel.reportFromDate=new NgbDate(FiscalYear.getFiscalStartYearByToday(this.todaydate),4,1)
   this.searchModel.reportToDate=this.todaydate;

    this.dtOptions = {
      paging:false,
      searching:false,
      dom: 'Bfrtip',
      select: {
        style:    'os,multi',
        selector: 'td:first-child'
    },
      buttons: [
        'selectAll',
        'selectNone',
        {
          extend:'excelHtml5',
          messageTop: `Outward Report  F.Y. - ${FiscalYear.getFiscalStartYearByToday(this.todaydate)} - ${FiscalYear.getFiscalStartYearByToday(this.todaydate)+1}`,
          className: 'far fa-file-excel',
          footer: true,
          customize: function (doc) {

            let sheet = doc.xl.worksheets['sheet1.xml'];

            let serviceAmountForPrint=0;
            let advanceAmountForPrint=0;
            let paidAmountForPrint=0;
            let outstandingAmountForPrint=0;

            for(let i=1;i< $('row c[r^="B"]', sheet).length;i++){

              let element=$('row c[r^="B"]', sheet)[i];
              $('c v', element).text(i);

            }

            for(let i=1;i< $('row c[r^="G"]', sheet).length-1;i++){
              let element=$('row c[r^="G"]', sheet)[i];
              if (parseFloat($('c v', element).text()) > 0) {
                serviceAmountForPrint=serviceAmountForPrint+parseFloat($('c v', element).text());
              }
            }

            for(let i=1;i< $('row c[r^="H"]', sheet).length-1;i++){
              let element=$('row c[r^="H"]', sheet)[i];
              if (parseFloat($('c v', element).text()) > 0) {
                advanceAmountForPrint=advanceAmountForPrint+parseFloat($('c v', element).text());
              }
            }

            for(let i=1;i< $('row c[r^="I"]', sheet).length-1;i++){
              let element=$('row c[r^="I"]', sheet)[i];
              if (parseFloat($('c v', element).text()) > 0) {
                paidAmountForPrint=paidAmountForPrint+parseFloat($('c v', element).text());
              }
            }

            for(let i=1;i< $('row c[r^="J"]', sheet).length-1;i++){
              let element=$('row c[r^="J"]', sheet)[i];
              if (parseFloat($('c v', element).text()) > 0) {
                outstandingAmountForPrint=outstandingAmountForPrint+parseFloat($('c v', element).text());
              }
            }

            $('c v', $('row c[r^="G"]', sheet)[$('row c[r^="F"]', sheet).length-1]).text(serviceAmountForPrint);
            $('c v', $('row c[r^="H"]', sheet)[$('row c[r^="G"]', sheet).length-1]).text(advanceAmountForPrint);
            $('c v', $('row c[r^="I"]', sheet)[$('row c[r^="H"]', sheet).length-1]).text(paidAmountForPrint);
            $('c v', $('row c[r^="J"]', sheet)[$('row c[r^="I"]', sheet).length-1]).text(outstandingAmountForPrint);


            $('row c[r^="J"]', sheet).each(function() {
              if (parseFloat($('c v', this).text()) > 0) {
                $(this).attr('s', '36');
              }
            });




        }
        },
       {
        extend: 'pdfHtml5',
        orientation: 'landscape',
        pageSize: 'LEGAL',
        messageTop: ``,
        className: 'far fa-file-pdf',
        footer: true,
        customize: function (doc) {
          doc.defaultStyle.alignment = 'right';
          doc.styles.tableHeader.alignment = 'right';
          doc.content[0].text = `Gopal Computers \n
        ${that.inwardAddressPrint} Contact : ${that.inwardAddressPhoneNoPrint} \n
        Outward Report \n
        F.Y. - ${FiscalYear.getFiscalStartYearByToday(that.todaydate)} - ${FiscalYear.getFiscalStartYearByToday(that.todaydate)+1}`;


          let docContent=doc.content[1];
          docContent.table.widths =
              Array(docContent.table.body[0].length + 1).join('*').split('');

              let serviceAmountForPrint=0;
              let advanceAmountForPrint=0;
              let paidAmountForPrint=0;
              let outstandingAmountForPrint=0;

              for (let r=1;r<docContent.table.body.length-1;r++) {
                let row = docContent.table.body[r];
                row[1].text=r;
                if(parseFloat(row[6].text)>0){
                  serviceAmountForPrint=serviceAmountForPrint+parseFloat(row[6].text);
                }
                if(parseFloat(row[7].text)>0){
                  advanceAmountForPrint=advanceAmountForPrint+parseFloat(row[7].text);
                }
                if(parseFloat(row[8].text)>0){
                  paidAmountForPrint=paidAmountForPrint+parseFloat(row[8].text);
                }
                if(parseFloat(row[9].text)>0){
                  outstandingAmountForPrint=outstandingAmountForPrint+parseFloat(row[9].text);
                }
              }
              docContent.table.body[docContent.table.body.length-1][6].text=serviceAmountForPrint;
              docContent.table.body[docContent.table.body.length-1][7].text=advanceAmountForPrint;
              docContent.table.body[docContent.table.body.length-1][8].text=paidAmountForPrint;
              docContent.table.body[docContent.table.body.length-1][9].text=outstandingAmountForPrint;


              for (let r=1;r<docContent.table.body.length;r++) {
                let row = docContent.table.body[r];
                if(parseFloat(row[9].text)>0){
                  row[9].color = 'red';
                }


            }
        }
    }],
    footerCallback: function ( row, data, start, end, display ) {

      var api = this.api(), data;

      // Remove the formatting to get integer data for summation
      let intVal = function ( i) {
          return typeof i === 'string' ? parseFloat(i) :
          typeof i === 'number' ?
              i : 0;
      };


      that.servicetotal = api
          .column( 6)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );
          that.advancetotal = api
          .column( 7)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );
          that.paidtotal = api
          .column( 8)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );
          that.outStandingtotal = api
          .column( 9)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );




  },
     columns: [
       {orderable: false,className: 'select-checkbox',targets:   0},
       { data: '',searchable:false,orderable:true  },
       { data: 'reportDate',searchable:false,orderable:true  },
      { data: 'reportId',searchable:false,orderable:true  },
      { data: 'jobNumbers',searchable:false,orderable:true  },
      { data: 'clientName',searchable:false,orderable:true  },
      { data: 'serviceAmount',searchable:false,orderable:true  },
      { data: 'advanceAmount',searchable:false,orderable:true  },
      { data: 'paidImmediatlyAmount',searchable:false,orderable:true  },
      { data: 'outstandingAmount',searchable:false,orderable:true  },]

    };
    this.GetOutwardReport(true);
  }

  clearFilter(){
    this.searchModel={reportId:'',customerName:null,reportFromDate:null,reportToDate:null};
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }
  GetOutwardReport(first=false){
    const that = this;
    this.reportService.GetOutwardReportList(this.searchModel).subscribe(data=>{

      let modelData=data.data;
      if(modelData)
      {
        that.lstOutwardReport = modelData.lstReport;
        that.inwardAddressPrint=modelData.inwardAddressPrint;
        that.inwardAddressPhoneNoPrint=modelData.inwardAddressPhoneNoPrint;
      }
      if(first)
      {
        that.dtTrigger.next();
      }
      else
      {
        that.rerender();
      }
    },error=>{
      console.log(error);
    })
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
    switchMap(term =>term.length < 2 ? []:
      this.typeAheadService.GetTypeAheadList(1,term,5)
      .pipe(
        tap(() => this.searchFailed = false),
        catchError(() => {
          this.searchFailed = true;
          return of([]);
        }))
    ),
    tap(() => this.searching = false)
  )
}
