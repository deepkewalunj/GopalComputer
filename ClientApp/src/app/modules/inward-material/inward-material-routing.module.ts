import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialTypeComponent } from './material-type/material-type.component';
import { MaterialCompanyComponent } from './material-company/material-company.component';
import { InwardMasterComponent } from './inward-master/inward-master.component';
import { InwardAccessoriesComponent } from './inward-accessories/inward-accessories.component';


const routes: Routes = [
 
  {
    path: 'inward-master', component: InwardMasterComponent
  },
  {
    path: 'material-company', component: MaterialCompanyComponent
  },
  {
    path: 'material-type', component: MaterialTypeComponent
  },
  {
    path: 'inward-accessories', component: InwardAccessoriesComponent
  },

  {
    path: '',
    redirectTo: '/inward-master',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardMaterialRoutingModule { }
