
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder} from '@angular/forms';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Customer } from 'src/app/models/customer.model';
import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { CustomerService } from 'src/app/services/customer.service';
import { DataTableDirective } from 'angular-datatables';
import { CommonModel, DataTablesResponse } from 'src/app/models/common.model';
import { SharedService } from '../../../../shared/shared.service';

@Component({
  selector: 'app-client',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent implements AfterViewInit, OnDestroy,OnInit {
  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  customers: Customer[];

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  deleteModelPopupRef:any;
  customerToDelete:Customer;
  customerDeleteError:"";
  dtTrigger: Subject<any> = new Subject();
    // we used reactive forms and validations
    addClientForm: FormGroup;
    constructor(private fb: FormBuilder, private modalService: NgbModal,private http: HttpClient,
      private customerService: CustomerService, public sharedService: SharedService) {}




  /*on click modal will be open*/

  openDelete(content,customer:Customer) {
    this.customerDeleteError="";
    const that=this;
    this.customerToDelete=customer;
    this.deleteModelPopupRef=this.modalService.open(content);
    this.deleteModelPopupRef.result.then((result) => {
      if(result==true)
      {


        that.rerender();
        that.customerToDelete=null;
        that._success.next("Customer Deleted Successfully.");

      }

    }, (reason) => {

    });
  }

  addClientPopup(currentCustomer:Customer) {
    let localCustomer=currentCustomer;
    if(localCustomer==null)
    {
      localCustomer=new Customer();
      localCustomer.clientTitleId='';

    }

    const modalRef = this.modalService.open(AddEditCustomerComponent, { size: 'lg',backdrop:'static' });
    modalRef.componentInstance.customer=localCustomer;
    modalRef.componentInstance.modelRef=modalRef;
    modalRef.result.then((result) => {
      if(result==true)
      {
        this.successMessage="Customer Saved Successfully.";
        this.rerender();
      }

    }, (reason) => {

    });
  }

  deleteCustomer(){
    this.customerDeleteError="";

    this.customerService.deleteCustomer(this.customerToDelete.clientId).subscribe((data)=>{
            this.deleteModelPopupRef.close(true);
      },(error)=>{
          if(error["1002"] && error["1002"].length>0)
          {
            this.customerDeleteError=error["1002"];
          }

      })
  }

   /*succes message code here*/

  ngOnInit(): void {



    const that = this;


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      ajax: (getCustomerListModel: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.API_URL+"Customer/GetCustomerList",
            {getListModel:getCustomerListModel},{}
        ).subscribe(resp => {
            that.customers =resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },order: [[ 5, "desc" ]],
      columns: [{ data: 'clientTitleId',searchable:true,orderable:true  },
                { data: 'companyName',searchable:true,orderable:true  },
                { data: 'clientName',searchable:true,orderable:true  },
                { data: 'ownerMobileNo',searchable:false,orderable:false  },
                { data: 'telNoFirst',searchable:false,orderable:false  },
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

  public getTitleNameById(id:string){
    let titles=CommonModel.getTitles();
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
  public changeSuccessMessage() {
    this._success.next('Record deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }

}

