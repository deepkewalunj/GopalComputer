
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup,  FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import {Subject} from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Customer } from 'src/app/models/Customer.model';



class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  customers: Customer[];

  searchFilter: boolean;

  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;

    // we used reactive forms and validations
    addClientForm: FormGroup;
    constructor(private fb: FormBuilder, private modalService: NgbModal,private http: HttpClient) {
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

  open(content) {
    this.modalService.open(content);
  }

  addClientPopup(content) {
    this.modalService.open(content, { size: 'lg' });
  }

   /*succes message code here*/

  ngOnInit(): void {



    const that = this;


    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
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
      columns: [{ data: 'clientId' }, { data: 'clientTitleId' }, { data: 'clientName' }]
    };
    setTimeout(() => this.staticAlertClosed = true, 20000);

    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(5000)
    ).subscribe(() => this.successMessage = null);
  }

  public changeSuccessMessage() {
    this._success.next('Record deleted successfully.');
  }

  /*on click search filter hide show on mobile*/

  toggleSearch() {
    this.searchFilter = !this.searchFilter;
  }

}

