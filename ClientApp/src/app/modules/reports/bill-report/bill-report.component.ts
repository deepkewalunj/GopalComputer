
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';
import { ReportModel, ReportSearchModel } from 'src/app/models/Report.model';
import { ReportService } from 'src/app/services/report.service';
import { Subject, Observable, of } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { TypeAheadResponseModel } from 'src/app/models/typeahead.model';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { TypeAheadService } from 'src/app/services/type-ahead.service';
import { FiscalYear } from 'src/app/models/FiscalYear.model';
import { EmailService } from 'src/app/services/email.service';

declare var pdfMake: any;
@Component({
  selector: 'app-bill-report',
  templateUrl: './bill-report.component.html',
  styleUrls: ['./bill-report.component.scss']
})
export class BillReportComponent implements OnInit {
  searchFilter: boolean;
  searchForm: FormGroup;
  lstBillReport:ReportModel[];
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
    private typeAheadService:TypeAheadService,
    private emailService:EmailService) { }

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
          text: 'Send to CA',
          className:'buttons-send-to-ca',
          extend: 'pdfHtml5',
          orientation: 'landscape',
          pageSize: 'LEGAL',
          messageTop: ``,
         footer: true,
         action: function ( e, dt, button, config ) {

          let allRows= dt.rows().data();
          let selectedRows= dt.rows( { selected: true } ).data();

          let lstReportId=[];

          if(selectedRows && selectedRows.length>0)
          {
            for(let i=0;i<selectedRows.length;i++)
            {
              lstReportId.push(selectedRows[i][""]);
            }

          }
          else if(allRows && allRows.length>0)
          {
            for(let i=0;i<allRows.length;i++)
            {
              lstReportId.push(allRows[i][""]);
            }
          }


         let doc= that.createDocPDF(config,dt)
         const pdfDocGenerator = pdfMake.createPdf(doc);
         pdfDocGenerator.getBlob((data) => {
         let outstandingFile= that.blobToFile(data,"Bill_Report.pdf");


         const formData = new FormData();

         formData.append("billreport_file", outstandingFile);
         formData.append("ClientIdArray",JSON.stringify(lstReportId) )

          that.emailService.SendEmailToCA(formData).subscribe(data=>{

          },error=>{
              console.log(error);
          })
         });
        },
          customize: function (doc) {
              that.customizeDocPDF(that,doc);

          }
      },
        {
          extend:'excel',
          messageTop: `Bill Report   F.Y. - ${FiscalYear.getFiscalStartYearByToday(this.todaydate)} - ${FiscalYear.getFiscalStartYearByToday(this.todaydate)+1}`,
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

            $('c v', $('row c[r^="G"]', sheet)[$('row c[r^="G"]', sheet).length-1]).text(serviceAmountForPrint);
            $('c v', $('row c[r^="H"]', sheet)[$('row c[r^="H"]', sheet).length-1]).text(advanceAmountForPrint);
            $('c v', $('row c[r^="I"]', sheet)[$('row c[r^="I"]', sheet).length-1]).text(paidAmountForPrint);
            $('c v', $('row c[r^="J"]', sheet)[$('row c[r^="J"]', sheet).length-1]).text(outstandingAmountForPrint);


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
          that.customizeDocPDF(that,doc);
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
     columns: [{orderable: false,className: 'select-checkbox',targets:   0},
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


  public blobToFile = (theBlob: Blob, fileName:string): File => {
    var b: any = theBlob;

    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
}

  createDocPDF(config,dt){

    var data = dt.buttons.exportData( config.exportOptions );
    var rows = [];

    if ( config.header ) {
      rows.push( $.map( data.header, function ( d ) {
        return {
          text: typeof d === 'string' ? d : d+'',
          style: 'tableHeader'
        };
      } ) );
    }

    for ( var i=0, ien=data.body.length ; i<ien ; i++ ) {
      rows.push( $.map( data.body[i], function ( d ) {
        return {
          text: typeof d === 'string' ? d : d+'',
          style: i % 2 ? 'tableBodyEven' : 'tableBodyOdd'
        };
      } ) );
    }

    if ( config.footer && data.footer) {
      rows.push( $.map( data.footer, function ( d ) {
        return {
          text: typeof d === 'string' ? d : d+'',
          style: 'tableFooter'
        };
      } ) );
    }

    var doc = {
      pageSize: config.pageSize,
      pageOrientation: config.orientation,
      content: [
        {
          table: {
            headerRows: 1,
            body: rows
          },
          layout: 'noBorders'
        }
      ] as any[],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'white',
          fillColor: '#2d4154',
          alignment: 'center'
        },
        tableBodyEven: {},
        tableBodyOdd: {
          fillColor: '#f3f3f3'
        },
        tableFooter: {
          bold: true,
          fontSize: 11,
          color: 'white',
          fillColor: '#2d4154'
        },
        title: {
          alignment: 'center',
          fontSize: 15
        },
        message: {}
      },
      defaultStyle: {
        fontSize: 10,
        alignment : 'right'
      }
    };

if ( config.message ) {
doc.content.unshift( {
  text: '',
  style: 'message',
  margin: [ 0, 0, 0, 12 ]
} );
}

if ( config.title ) {
doc.content.unshift( {
  text: 'Gopal Computers',
  style: 'title',
  margin: [ 0, 0, 0, 12 ]
} );
}
    if ( config.customize ) {
      config.customize( doc, config );
    }

    return doc;
  }

  customizeDocPDF(that,doc){


    doc.defaultStyle.alignment = 'right';
    doc.styles.tableHeader.alignment = 'right';
    doc.content[0].text = `Gopal Computers \n
    ${that.inwardAddressPrint} Contact : ${that.inwardAddressPhoneNoPrint} \n
    Bill Report \n
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

  clearFilter(){
    this.searchModel={reportId:'',customerName:null,reportFromDate:null,reportToDate:null};
  }

  GetBillReport(first=false){
    const that = this;
    this.reportService.GetBillReportList(this.searchModel).subscribe(data=>{
      let modelData=data.data;
      if(modelData)
      {
        that.lstBillReport = modelData.lstReport;
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
