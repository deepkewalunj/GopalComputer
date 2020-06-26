import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MasterRoutingModule } from './master-routing.module';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { AddEditCustomerComponent } from './customer/add-edit-customer/add-edit-customer.component';

@NgModule({
  declarations: [CustomerListComponent, AddEditCustomerComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    MasterRoutingModule,
    CommonModule,
    NgbModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class MasterModule { }
