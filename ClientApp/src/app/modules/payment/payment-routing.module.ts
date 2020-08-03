import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LumpsumComponent } from '../payment/lumpsum/lumpsum.component';
import { LumpsumGenerationComponent } from '../payment/lumpsum-generation/lumpsum-generation.component';
import { LumpsumPrintComponent } from '../payment/lumpsum-print/lumpsum-print.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';
import { AuthorizationCheck } from 'src/app/services/authorization-Check';


const routes: Routes = [
  { path: 'lumpsum', component: LumpsumComponent ,canActivate: [AuthorizationCheck],
  data:{permission:["Lumpsum"]}},
  { path: 'lumpsum-generation', component: LumpsumGenerationComponent ,canActivate: [AuthorizationCheck],
  data:{permission:["Lumpsum"]}},
  { path: 'lumpsum-print', component: LumpsumPrintComponent ,canActivate: [AuthorizationCheck],
  data:{permission:["Lumpsum"]}},
  { path: 'bill-details', component: BillDetailsComponent,
  canActivate: [AuthorizationCheck],
  data:{permission:["Collection Report"]}
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
