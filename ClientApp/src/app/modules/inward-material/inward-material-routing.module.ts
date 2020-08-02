import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialTypeComponent } from './material-type/material-type.component';
import { InwardAccessoriesComponent } from './inward-accessories/inward-accessories.component';
import { InwardComponent } from './inward/inward.component';
import { AddInwardComponent } from './add-inward/add-inward.component';
import { AddUpdateModelNoMaterialTypeComponent } from './add-update-model-no-material-type/add-update-model-no-material-type.component';
import { AddEditAccessoryComponent } from './add-edit-accessory/add-edit-accessory.component';
import { InwardPrintComponent } from './inward-print/inward-print.component';
import { BillPrintComponent } from './bill-print/bill-print.component';
import { OutwardPrintComponent } from './outward-print/outward-print.component';
import { BillGenerationComponent } from './bill-generation/bill-generation.component';
import { OutwardComponent } from './outward/outward.component';
import { BillingListComponent } from './billing-list/billing-list.component';
import { OutwardListComponent } from './outward-list/outward-list.component';
import { AuthorizationCheck } from 'src/app/services/authorization-Check';


const routes: Routes = [
 {
   path: 'inward', component: InwardComponent,
   canActivate: [AuthorizationCheck],
    data:{permission:["Inward"]}
 },

 {
  path: 'add-inward', component: AddInwardComponent,
  canActivate: [AuthorizationCheck],
  data:{permission:["Inward"]}
},
{
  path: 'add-inward/:inwardId', component: AddInwardComponent,
  canActivate: [AuthorizationCheck],
  data:{permission:["Inward"]}
},
  {
    path: 'material-type', component: MaterialTypeComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Material Type"]}
  },
  {
    path: 'inward-accessories', component: InwardAccessoriesComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Inward Accessories"]}
  },

  {
    path: 'add-material-type', component: AddUpdateModelNoMaterialTypeComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Material Type"]}
  },
  {
    path: 'add-accessory', component: AddEditAccessoryComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Inward Accessories"]}
  },
  {
    path: 'inward-print', component: InwardPrintComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Inward"]}
  },
  {
    path: 'bill-generation', component: BillGenerationComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Billing List"]}
  },
  {
    path: 'outward', component: OutwardComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Outward List"]}
  },
  {
    path: 'billing-list', component: BillingListComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Billing List"]}
  },
  {
    path: 'outward-list', component: OutwardListComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Outward List"]}
  },
  {
    path: 'bill-print', component: BillPrintComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Billing List"]}
  },
  {
    path: 'outward-print', component: OutwardPrintComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Outward List"]}
  },
  {
    path: '',
    redirectTo: '/inward',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardMaterialRoutingModule { }
