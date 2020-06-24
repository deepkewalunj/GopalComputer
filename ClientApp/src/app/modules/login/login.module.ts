import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import {LoginRoutingModule} from './login-routing.module';
import { LoginComponent } from './login.component';
 
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    NgbModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule
  ]
})
export class LoginModule { 
  constructor() {
  }
}
