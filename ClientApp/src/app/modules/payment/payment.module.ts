import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { PaymentRoutingModule } from './payment-routing.module';
import { LumpsumComponent } from './lumpsum/lumpsum.component';
import { LumpsumGenerationComponent } from './lumpsum-generation/lumpsum-generation.component';
import { LumpsumPrintComponent } from './lumpsum-print/lumpsum-print.component';



@NgModule({
  declarations: [LumpsumComponent, LumpsumGenerationComponent, LumpsumPrintComponent],
  imports: [
    CommonModule,
    PaymentRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    AngularMultiSelectModule,
    NgbModule
    
  ]
})
export class PaymentModule { }
