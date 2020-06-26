import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { AddEditCustomerComponent } from './customer/add-edit-customer/add-edit-customer.component';


const routes: Routes = [
  {
    path:'', component: CustomerListComponent
  },
  {
    path:'add-customer', component: AddEditCustomerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
