import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LumpsumComponent } from '../payment/lumpsum/lumpsum.component';
import { LumpsumGenerationComponent } from '../payment/lumpsum-generation/lumpsum-generation.component';
import { LumpsumPrintComponent } from '../payment/lumpsum-print/lumpsum-print.component';


const routes: Routes = [
  { path: 'lumpsum', component: LumpsumComponent },
  { path: 'lumpsum-generation', component: LumpsumGenerationComponent },
  { path: 'lumpsum-print', component: LumpsumPrintComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
