
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import { Inward, InwardListModel, InwardCustomSearch } from 'src/app/models/inward.model';
import { DataTablesResponse, CommonModel } from 'src/app/models/common.model';
import { environment } from 'src/environments/environment';
import { InwardService } from 'src/app/services/inward.service';
import { DataTableDirective } from 'angular-datatables';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { InwardPrintComponent } from '../inward-print/inward-print.component';
import { SharedService } from '../../../shared/shared.service';
import { debounce } from 'rxjs-compat/operator/debounce';

@Component({
  selector: 'app-inward',
  templateUrl: './inward.component.html',
  styleUrls: ['./inward.component.scss']
})
export class InwardComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  inwards: InwardListModel[];
  inward: Inward;
  searchFilter: boolean;
  inwardSearchAll: InwardCustomSearch;
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  hideTable: boolean = false;
  dtTrigger: Subject<any> = new Subject();
    // we used reactive forms and validations
  addClientForm: FormGroup;
  
    constructor(private fb: FormBuilder,private http: HttpClient,
      private modalService: NgbModal,private inwardService:InwardService,
      private router: Router, private route: ActivatedRoute, public sharedService: SharedService) {
      this.inwardSearchAll = new InwardCustomSearch();
    }




  /*on click modal will be open*/


  openDelete(content,inward:Inward) {
    this.inwardDeleteError="";
    const that=this;
    this.inwardToDelete=inward;
    this.deleteModelPopupRef=this.modalService.open(content);
    this.deleteModelPopupRef.result.then((result) => {
      if(result==true)
      {

        // to do refresh
        //that.rerender();
        that.inwardToDelete=null;
        that._success.next("Inward Deleted Successfully.");
        if (that.getIsAllSearchDoable()) {
          that.inwardService.GetInwardListBYSearchAll(that.inwardSearchAll).subscribe(data => {
            that.inwards = data.data;
          }, error => {

          });
        }
        else {
          that.rerender();
        }
      }

    }, (reason) => {

    });
  }




  inwardDeleteError:""
  inwardToDelete:Inward;
  deleteModelPopupRef:any;
  deleteInward(){
    this.inwardDeleteError="";

    this.inwardService.deleteInward(this.inwardToDelete.inwardId).subscribe((data)=>{
            this.deleteModelPopupRef.close(true);
      },(error)=>{
          if(error["1003"] && error["1003"].length>0)
          {
            this.inwardDeleteError=error["1003"];
          }

      })
  }

  addEditInward(inwardId:number)
  {
    if(inwardId>0)
    {
      this.router.navigate(['inward-material/add-inward',inwardId]);
    }
    else
    {
      this.router.navigate(['inward-material/add-inward']);
    }


  }

  GetInwardData() {
    
    this.getIsAllSearchDoable();
    if (this.getIsAllSearchDoable()) {
      this.inwardService.GetInwardListBYSearchAll(this.inwardSearchAll).subscribe(data => {
        this.inwards = data.data;
      }, error => {

      });
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        //this.dtTrigger.next();
      });
      
    }
    
    
  }

  clearFilter() {
    
    window.location.reload();
    
  }

  getIsAllSearchDoable() {
    
    var result = false;
    if (this.inwardSearchAll.companyName) result = true;
    if (this.inwardSearchAll.modelNo) result = true;
    if (this.inwardSearchAll.jobStatus) result = true;
    if (this.inwardSearchAll.billStatus) result = true;
    if (this.inwardSearchAll.inwardDate) result = true;
    if (this.inwardSearchAll.materialType) result = true;
    if (this.inwardSearchAll.materialCompanyName) result = true;
    if (this.inwardSearchAll.serialNo) result = true;
    if (this.inwardSearchAll.problemDescription) result = true;
    if (this.inwardSearchAll.enggName) result = true;
    if (result) {
      this.hideTable = true;
    }
    return result;
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('print-section').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <style>
          //........Customized style.......
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  printInward(inwardId) {
    if (inwardId > 0) {
      this.givePrint(inwardId);
    }
  }

  givePrint(inwardId) {
    this.inwardService.getInward(inwardId).subscribe(data => {
      this.inward = data;
      this.openInwardPrintPopup(this.inward);
    }, error => {

    });
  }

  openInwardPrintPopup(inward) {
    const modalRef = this.modalService.open(InwardPrintComponent, { size: 'lg', windowClass: 'print-modal' });
    modalRef.componentInstance.inward = inward;
    modalRef.componentInstance.modelRef = modalRef;
    modalRef.result.then((result) => {
      if (result == true) {
        this._success.next("Print done.")
      }

    }, (reason) => {

    });
  }

  ngOnInit(): void {


    
    const that = this;


    //this.clearFilter();

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      searchDelay: 1000,
      ajax: (getCustomerListModel: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.API_URL+"Inward/GetInwardList",
            {getListModel:getCustomerListModel},{}
          ).subscribe(resp => {
            that.inwards = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },order: [[ 6, "desc" ]],
      columns: [{ data: 'inwardId',searchable:true,orderable:true  },
                { data: 'clientName',searchable:true,orderable:true  },
                { data: 'modelNo',searchable:true,orderable:true  },
                { data: 'isRepaired',searchable:true,orderable:true  },
                { data: 'deliveryDate',searchable:false,orderable:true  },
                { data: 'outwardBillStatus',searchable:false,orderable:true  },
                {data:null,searchable:false,orderable:false }]
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

  public getInwardOutwardBillStatusById(id:string){
    let titles=CommonModel.getInwardOutwardBillStatuses();
    let titleName:string =titles.find(x=>x.id==id).name;
    if(titleName)
    {
      return titleName;
    }
    else
    {
      return "";
    }
  }

  public getRepairedStatusesById(id:string){
    let statuses=CommonModel.getRepairedStatuses();
    let titleName:string =statuses.find(x=>x.id==id).name;
    if(titleName)
    {
      return titleName;
    }
    else
    {
      return "";
    }
  }

  public changeSuccessMessage() {
    this._success.next('Record deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }
}


