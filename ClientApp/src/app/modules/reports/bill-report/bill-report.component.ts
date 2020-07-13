
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { NgbModal, NgbDate, NgbCalendar ,NgbPeriod} from '@ng-bootstrap/ng-bootstrap';
import { BillOutwardReportModel, BillOutwardReportSearchModel } from 'src/app/models/Bill.model';
import { BillService } from 'src/app/services/bill.service';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';

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

  dtTrigger: Subject<any> = new Subject();
  dtOptions: {};
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;

  constructor(private ngbCalendar: NgbCalendar,private billService:BillService) { }

  ngOnInit() {
    this.searchModel={billNo:'',customerName:'',reportFromDate:null,reportToDate:null};
    const that=this;

    this.dtOptions = {
      paging:false,
      searching:false,
      dom: 'Bfrtip',
      buttons: ['excel',{
        extend: 'pdfHtml5',
        orientation: 'landscape',
        pageSize: 'LEGAL',
        messageTop: 'Inward Bill Report'
    }],
     columns: [{ data: 'reportDate',searchable:false,orderable:true  },
      { data: 'reportId',searchable:false,orderable:true  },
      { data: 'inwardId',searchable:false,orderable:true  },
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

}
