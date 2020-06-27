
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Customer } from 'src/app/models/Customer.model';
import { AddEditCustomerComponent } from '../add-edit-customer/add-edit-customer.component';
import { CustomerService } from 'src/app/services/customer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataTableDirective } from 'angular-datatables';



class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


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

  dtTrigger: Subject<any> = new Subject();
    // we used reactive forms and validations
    addClientForm: FormGroup;
    constructor(private fb: FormBuilder, private modalService: NgbModal,private http: HttpClient,
      private customerService:CustomerService) {
     this.createForm();
    }

    createForm() {
      this.addClientForm = this.fb.group({
        title:      ['', Validators.required],
      personName: ['', Validators.required],
      companyName:          ['', Validators.required],
      phoneNo: ['', Validators.required],
      },

      );
    }


  /*on click modal will be open*/

  openDelete(content,customer:Customer) {

    const that=this;

    this.modalService.open(content).result.then((result) => {
      if(result==true)
      {


        that.deleteCustomer(customer,that);

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
    const modalRef = this.modalService.open(AddEditCustomerComponent, { size: 'lg' });
    modalRef.componentInstance.customer=localCustomer;
    modalRef.componentInstance.modelRef=modalRef;
    modalRef.result.then((result) => {
      if(result==true)
      {
        this.successMessage="Customer Saved Successfully.";
      }

    }, (reason) => {

    });
  }

  deleteCustomer(customer:Customer,that){
    that.customerService.deleteCustomer(customer.clientId).subscribe((data)=>{

        that.rerender();
        that.successMessage="Customer Deleted Successfully."
      },(error)=>{


      })
  }

   /*succes message code here*/

  ngOnInit(): void {



    const that = this;


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (getCustomerListModel: any, callback) => {
        that.http
          .post<DataTablesResponse>(
            environment.API_URL+"Customer/GetCustomerList",
            {getCustomerListModel:getCustomerListModel},{}
          ).subscribe(resp => {
            that.customers = resp.data;
            callback({
              recordsTotal: resp.recordsTotal,
              recordsFiltered: resp.recordsFiltered,
              data: []
            });
          });
      },
      columns: [{ data: 'clientTitleId',searchable:true,orderable:true  }, { data: 'clientName',searchable:true,orderable:true  },
                { data: 'companyName',searchable:true,orderable:true  },{ data: 'ownerMobileNo',searchable:false,orderable:false  },{ data: 'telNoFirst',searchable:false,orderable:false  },
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
    debugger;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  public changeSuccessMessage() {
    this._success.next('Record deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }

}

