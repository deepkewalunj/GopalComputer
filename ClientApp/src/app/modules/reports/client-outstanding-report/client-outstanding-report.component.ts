
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';
import { ReportModel, ReportSearchModel } from 'src/app/models/Report.model';
import { Subject, Observable, of } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { TypeAheadResponseModel } from 'src/app/models/typeahead.model';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { ReportService } from 'src/app/services/report.service';
import { FiscalYear } from 'src/app/models/FiscalYear.model';

@Component({
  selector: 'app-client-outstanding-report',
  templateUrl: './client-outstanding-report.component.html',
  styleUrls: ['./client-outstanding-report.component.scss']
})
export class ClientOutstandingReportComponent implements OnInit {
  searchFilter: boolean;
  searchForm: FormGroup;
  lstOutstandingReport:ReportModel[];
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

  constructor(private ngbCalendar: NgbCalendar,
    private reportService:ReportService,
    private typeAheadService:TypeAheadService) { }

  ngOnInit() {

    const that=this;
    this.todaydate=this.ngbCalendar.getToday();
    this.clearFilter();
    this.searchModel.reportFromDate=new NgbDate(FiscalYear.getFiscalStartYearByToday(this.todaydate),4,1)
    this.searchModel.reportToDate=this.todaydate
    this.dtOptions = {
      paging:false,
      searching:false,
      dom: 'Bfrtip',
      select: {
      style:    'os,multi',
      selector: 'td:first-child',

  },


      buttons: [
        'selectAll',
        'selectNone',
        {
          extend:'excel',
          messageTop: `Client O/S Report   F.Y. - ${FiscalYear.getFiscalStartYearByToday(this.todaydate)} - ${FiscalYear.getFiscalStartYearByToday(this.todaydate)+1}`,
          className: 'far fa-file-excel',
          footer: true,
          customize: function (doc) {

            let sheet = doc.xl.worksheets['sheet1.xml'];

            let serviceAmountForPrint=0;
            let advanceAmountForPrint=0;
            let outstandingAmountForPrint=0;

            for(let i=1;i< $('row c[r^="B"]', sheet).length;i++){

              let element=$('row c[r^="B"]', sheet)[i];
              $('c v', element).text(i);

            }

            for(let i=1;i< $('row c[r^="D"]', sheet).length-1;i++){
              let element=$('row c[r^="D"]', sheet)[i];
              if (parseFloat($('c v', element).text()) > 0) {
                serviceAmountForPrint=serviceAmountForPrint+parseFloat($('c v', element).text());
              }
            }

            for(let i=1;i< $('row c[r^="E"]', sheet).length-1;i++){
              let element=$('row c[r^="E"]', sheet)[i];
              if (parseFloat($('c v', element).text()) > 0) {
                advanceAmountForPrint=advanceAmountForPrint+parseFloat($('c v', element).text());
              }
            }

            for(let i=1;i< $('row c[r^="F"]', sheet).length-1;i++){
              let element=$('row c[r^="F"]', sheet)[i];
              if (parseFloat($('c v', element).text()) > 0) {
                outstandingAmountForPrint=outstandingAmountForPrint+parseFloat($('c v', element).text());
              }
            }



            $('c v', $('row c[r^="D"]', sheet)[$('row c[r^="D"]', sheet).length-1]).text(serviceAmountForPrint);
            $('c v', $('row c[r^="E"]', sheet)[$('row c[r^="E"]', sheet).length-1]).text(advanceAmountForPrint);
            $('c v', $('row c[r^="F"]', sheet)[$('row c[r^="F"]', sheet).length-1]).text(outstandingAmountForPrint);

            $('row c[r^="F"]', sheet).each(function() {
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
        Client O/S Report  \n
        F.Y. - ${FiscalYear.getFiscalStartYearByToday(that.todaydate)} - ${FiscalYear.getFiscalStartYearByToday(that.todaydate)+1}`;

        let docContent=doc.content[1];

          docContent.table.widths =
              Array(docContent.table.body[0].length + 1).join('*').split('');

              let serviceAmountForPrint=0;
              let advanceAmountForPrint=0;
              let outstandingAmountForPrint=0;

              for (let r=1;r<docContent.table.body.length-1;r++) {
                let row = docContent.table.body[r];
                row[1].text=r;
                if(parseFloat(row[3].text)>0){
                  serviceAmountForPrint=serviceAmountForPrint+parseFloat(row[3].text);
                }
                if(parseFloat(row[4].text)>0){
                  advanceAmountForPrint=advanceAmountForPrint+parseFloat(row[4].text);
                }
                if(parseFloat(row[5].text)>0){
                  outstandingAmountForPrint=outstandingAmountForPrint+parseFloat(row[5].text);
                }

              }
              docContent.table.body[docContent.table.body.length-1][3].text=serviceAmountForPrint;
              docContent.table.body[docContent.table.body.length-1][4].text=advanceAmountForPrint;
              docContent.table.body[docContent.table.body.length-1][5].text=outstandingAmountForPrint;

              for (let r=1;r<docContent.table.body.length;r++) {
                let row = docContent.table.body[r];
                if(parseFloat(row[5].text)>0){
                  row[5].color = 'red';
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
          .column( 3)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );
          that.advancetotal = api
          .column( 4)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );
          that.outStandingtotal= api
          .column( 5)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );




  },
     columns: [{orderable: false,className: 'select-checkbox',targets:   0},
     { data: '',searchable:false,orderable:true  },
     { data: 'clientName',searchable:false,orderable:true  },
      { data: 'serviceAmount',searchable:false,orderable:true  },
      { data: 'advanceAmount',searchable:false,orderable:true  },
      { data: 'outstandingAmount',searchable:false,orderable:true  },
      ]

    };
    this.GetClientOutstandingReport(true);
  }
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  clearFilter(){
    this.searchModel={reportId:'',customerName:null,reportFromDate:null,reportToDate:null};
  }

  GetClientOutstandingReport(first=false){
    const that = this;
    this.reportService.GetClientOutstandingReportList().subscribe(data=>{

      let modelData=data.data;
      if(modelData)
      {
        that.lstOutstandingReport = modelData.lstReport;
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
