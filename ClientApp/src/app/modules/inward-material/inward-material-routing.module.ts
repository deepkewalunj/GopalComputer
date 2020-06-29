import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MaterialTypeComponent } from './material-type/material-type.component';
import { InwardMasterComponent } from './inward-master/inward-master.component';
import { InwardAccessoriesComponent } from './inward-accessories/inward-accessories.component';
import { InwardComponent } from './inward/inward.component';
import { AddInwardComponent } from './add-inward/add-inward.component';


const routes: Routes = [
 {
   path: 'inward', component: InwardComponent
 },

 {
  path: 'add-inward', component: AddInwardComponent
},
  {
    path: 'inward-master', component: InwardMasterComponent
  },
  {
    path: 'material-type', component: MaterialTypeComponent
  },
  {
    path: 'inward-accessories', component: InwardAccessoriesComponent
  },

  {
    path: '',
    redirectTo: '/inward',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InwardMaterialRoutingModule { }
