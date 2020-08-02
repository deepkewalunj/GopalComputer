import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillReportComponent } from './bill-report/bill-report.component';
import { OutwardReportComponent } from './outward-report/outward-report.component';
import { InwardReportComponent } from './inward-report/inward-report.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';
import { ClientOutstandingReportComponent } from './client-outstanding-report/client-outstanding-report.component';
import { AuthorizationCheck } from 'src/app/services/authorization-Check';


const routes: Routes = [

{path: "bill-report", component: BillReportComponent, canActivate: [AuthorizationCheck],
data:{permission:["Bill Reports"]}},
{path: "outward-report", component: OutwardReportComponent,canActivate: [AuthorizationCheck],
data:{permission:["Outward Reports"]}},
{path: "inward-report", component: InwardReportComponent,canActivate: [AuthorizationCheck],
data:{permission:["Inward Reports"]}},
{path: "client-outstanding-report", component: ClientOutstandingReportComponent,canActivate: [AuthorizationCheck],
data:{permission:["Client O/S Reports"]}},
{path: "account-statement", component: AccountStatementComponent,canActivate: [AuthorizationCheck],
data:{permission:["Account Statement"]}},
{
  path: '',
  redirectTo: '/bill-report',
  pathMatch: 'full',
  canActivate: [AuthorizationCheck],
    data:{permission:["Bill Reports"]}
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
