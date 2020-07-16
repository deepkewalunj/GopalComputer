import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillReportComponent } from './bill-report/bill-report.component';
import { OutwardReportComponent } from './outward-report/outward-report.component';
import { InwardReportComponent } from './inward-report/inward-report.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';


const routes: Routes = [

{path: "bill-report", component: BillReportComponent},
{path: "outward-report", component: OutwardReportComponent},
{path: "inward-report", component: InwardReportComponent},
{path: "client-outstanding-report", component: InwardReportComponent},
{path: "account-statement", component: AccountStatementComponent},
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
