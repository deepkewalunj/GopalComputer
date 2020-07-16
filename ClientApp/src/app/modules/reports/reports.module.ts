import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
import { BillReportComponent } from './bill-report/bill-report.component';
import { OutwardReportComponent } from './outward-report/outward-report.component';
import { DataTablesModule } from 'angular-datatables';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { InwardReportComponent } from './inward-report/inward-report.component';
import { ClientOutstandingReportComponent } from './client-outstanding-report/client-outstanding-report.component';
import { AccountStatementComponent } from './account-statement/account-statement.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};
@NgModule({
  declarations: [BillReportComponent, OutwardReportComponent,
    InwardReportComponent,ClientOutstandingReportComponent, AccountStatementComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    DataTablesModule,
    NgbModule,
    ReactiveFormsModule,

    NgxMaskModule.forRoot(maskConfig),
    FormsModule,
  ]
})
export class ReportsModule { }
