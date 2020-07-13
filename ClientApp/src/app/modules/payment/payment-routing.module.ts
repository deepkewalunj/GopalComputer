import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LumpsumComponent } from '../payment/lumpsum/lumpsum.component';


const routes: Routes = [{ path: '', component: LumpsumComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
