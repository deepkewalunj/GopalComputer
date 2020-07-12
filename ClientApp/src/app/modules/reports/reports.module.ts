import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { ReportsRoutingModule } from './reports-routing.module';
import { BillReportComponent } from './bill-report/bill-report.component';
import { OutwardReportComponent } from './outward-report/outward-report.component';


@NgModule({
  declarations: [BillReportComponent, OutwardReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    NgbModule,
    ReactiveFormsModule
  ]
})
export class ReportsModule { }
