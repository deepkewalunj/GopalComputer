import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { AddEditCustomerComponent } from './customer/add-edit-customer/add-edit-customer.component';
import { AuthorizationCheck } from 'src/app/services/authorization-Check';


const routes: Routes = [
  {
    path:'', component: CustomerListComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Client"]}
  },
  {
    path:'add-customer', component: AddEditCustomerComponent,
    canActivate: [AuthorizationCheck],
  data:{permission:["Client"]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
