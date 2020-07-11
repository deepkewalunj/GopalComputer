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


const routes: Routes = [
 {
   path: 'inward', component: InwardComponent
 },

 {
  path: 'add-inward', component: AddInwardComponent
},
{
  path: 'add-inward/:inwardId', component: AddInwardComponent
},
  {
    path: 'material-type', component: MaterialTypeComponent
  },
  {
    path: 'inward-accessories', component: InwardAccessoriesComponent
  },
  {
    path: 'inward-accessories', component: InwardAccessoriesComponent
  },
  {
    path: 'add-material-type', component: AddUpdateModelNoMaterialTypeComponent
  },
  {
    path: 'add-accessory', component: AddEditAccessoryComponent
  },
  {
    path: 'inward-print', component: InwardPrintComponent
  },
  {
    path: 'bill-generation', component: BillGenerationComponent
  },
  {
    path: 'outward', component: OutwardComponent
  },
  {
    path: 'billing-list', component: BillingListComponent
  },
  {
    path: 'outward-list', component: OutwardListComponent
  },
  {
    path: 'bill-print', component: BillPrintComponent
  },
  {
    path: 'outward-print', component: OutwardPrintComponent
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
