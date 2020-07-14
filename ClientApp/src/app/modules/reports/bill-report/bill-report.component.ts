
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';
import { BillOutwardReportModel, BillOutwardReportSearchModel } from 'src/app/models/Bill.model';
import { BillService } from 'src/app/services/bill.service';
import { Subject, Observable, of } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { TypeAheadResponseModel } from 'src/app/models/typeahead.model';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { TypeAheadService } from 'src/app/services/type-ahead.service';

@Component({
  selector: 'app-bill-report',
  templateUrl: './bill-report.component.html',
  styleUrls: ['./bill-report.component.scss']
})
export class BillReportComponent implements OnInit {
  searchFilter: boolean;
  searchForm: FormGroup;
  lstBillReport:BillOutwardReportModel[];
  searchModel:BillOutwardReportSearchModel;
  formatter = (typeAhead: TypeAheadResponseModel) => typeAhead.searchValue;

  dtTrigger: Subject<any> = new Subject();
  dtOptions: {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  servicetotal:number=0;
  advancetotal:number=0;
  paidtotal:number=0;
  outStandingtotal:number=0;

  searching = false;
  searchFailed = false;

  constructor(private ngbCalendar: NgbCalendar,
    private billService:BillService,
    private typeAheadService:TypeAheadService) { }

  ngOnInit() {

    const that=this;
    this.clearFilter();
    this.searchModel.reportFromDate=this.ngbCalendar.getToday();
    this.searchModel.reportToDate=this.ngbCalendar.getToday();
    this.dtOptions = {
      paging:false,
      searching:false,
      dom: 'Bfrtip',
      buttons: [
        {
          extend:'excel',
          messageTop: 'Inward Bill Report',
          footer: true,
          customize: function (doc) {
            let sheet = doc.xl.worksheets['sheet1.xml'];
            $('row c[r^="G"]', sheet).each(function() {
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
        messageTop: 'Inward Bill Report',
        footer: true,
        customize: function (doc) {
          doc.content[2].table.widths =
              Array(doc.content[2].table.body[0].length + 1).join('*').split('');

              for (let r=1;r<doc.content[2].table.body.length;r++) {
                let row = doc.content[2].table.body[r];
                if(parseFloat(row[6].text)>0){
                  row[6].color = 'red';
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
          that.paidtotal = api
          .column( 5)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );
          that.outStandingtotal = api
          .column( 6)
          .data()
          .reduce( function (a, b) {
              return intVal(a) + intVal(b);
          }, 0 );




  },
     columns: [{ data: 'reportDate',searchable:false,orderable:true  },
      { data: 'reportId',searchable:false,orderable:true  },
      { data: 'jobNumbers',searchable:false,orderable:true  },
      { data: 'serviceAmount',searchable:false,orderable:true  },
      { data: 'advanceAmount',searchable:false,orderable:true  },
      { data: 'paidImmediatlyAmount',searchable:false,orderable:true  },
      { data: 'outstandingAmount',searchable:false,orderable:true  },]

    };
    this.GetBillReport(true);
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

  GetBillReport(first=false){
    const that = this;
    this.billService.GetBillReportList(this.searchModel).subscribe(data=>{
      that.lstBillReport = data.data;
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
        this.typeAheadService.GetTypeAheadList(1,term,1)
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
