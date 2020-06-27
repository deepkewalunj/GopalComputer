import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { InwardMaterialRoutingModule } from './inward-material-routing.module';
import { InwardMasterComponent } from './inward-master/inward-master.component';
import { MaterialCompanyComponent } from './material-company/material-company.component';
import { MaterialTypeComponent } from './material-type/material-type.component';
import { InwardAccessoriesComponent } from './inward-accessories/inward-accessories.component';
import { InwardComponent } from './inward/inward.component';
import { AddInwardComponent } from './add-inward/add-inward.component';


@NgModule({
  declarations: [
    MaterialTypeComponent,
    MaterialCompanyComponent,
    InwardMasterComponent,
    InwardAccessoriesComponent,
    InwardComponent,
    AddInwardComponent
  ],
  imports: [
    CommonModule,
    InwardMaterialRoutingModule,
    NgbModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class InwardMaterialModule { }
