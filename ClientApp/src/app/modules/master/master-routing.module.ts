import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { AddClientComponent } from './add-client/add-client.component';


const routes: Routes = [
  {
    path:'', component: ClientComponent
  },
  {
    path:'add-client', component: AddClientComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterRoutingModule { }
