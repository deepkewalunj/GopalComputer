import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LumpsumComponent } from '../payment/lumpsum/lumpsum.component';
import { LumpsumGenerationComponent } from '../payment/lumpsum-generation/lumpsum-generation.component';
import { LumpsumPrintComponent } from '../payment/lumpsum-print/lumpsum-print.component';
import { BillDetailsComponent } from './bill-details/bill-details.component';


const routes: Routes = [
  { path: 'lumpsum', component: LumpsumComponent },
  { path: 'lumpsum-generation', component: LumpsumGenerationComponent },
  { path: 'lumpsum-print', component: LumpsumPrintComponent },
  { path: 'bill-details', component: BillDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
