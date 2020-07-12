import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillReportComponent } from './bill-report/bill-report.component';
import { OutwardReportComponent } from './outward-report/outward-report.component';


const routes: Routes = [

{path: "bill-report", component: BillReportComponent},
{path: "outward-report", component: OutwardReportComponent},

{
  path: '',
  redirectTo: '/bill-report',
  pathMatch: 'full'
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
