import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersListComponent } from './users-list/users-list.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { AuthorizationCheck } from 'src/app/services/authorization-Check';


const routes: Routes = [
  {
    path: '', component: UsersListComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Users"]}

  },
  {
    path:'add-customer', component: AddEditUserComponent,
    canActivate: [AuthorizationCheck],
    data:{permission:["Users"]}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
