import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

//CustomPreloadingStrategy service used for preloading module

import { CustomPreloadingStrategy } from './services/custom-preloading-strategy.service';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { SampleListComponent } from './sample-list/sample-list.component';



import { AuthorizationCheck } from './services/authorization-Check';



// routing and lazyloading with prealoding declaration for all modules this is main routing module of app

const routes: Routes = [

  {
    path: 'sample-form',
    component: SampleFormComponent
  },

   {
     path: 'sample-list',
     component: SampleListComponent
  },

  {
    path: 'users',
    loadChildren: './modules/users/users.module#UsersModule',
    canActivate: [AuthorizationCheck],
    data:{permission:["Users"]}
  },

  {
    path: 'master',
    loadChildren: './modules/master/master.module#MasterModule',
    canActivate: [AuthorizationCheck],
    data:{permission:["Master"]}
  },

  {
    path: 'inward-material',
    loadChildren: './modules/inward-material/inward-material.module#InwardMaterialModule',
    canActivate: [AuthorizationCheck],
    data:{permission:["Inward Material"]}
  },

  {
    path: 'forgot-password',
    loadChildren: './modules/forgot-password/forgot-password.module#ForgotPasswordModule',
  },
  {
    path: 'reports',
    loadChildren: './modules/reports/reports.module#ReportsModule',
    canActivate: [AuthorizationCheck],
    data:{permission:["Reports"]}
  },
  {
    path: 'login',
    loadChildren: './modules/login/login.module#LoginModule',
  },

  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  { path: 'payment', loadChildren: () => import('./modules/payment/payment.module').then(m => m.PaymentModule), canActivate: [AuthorizationCheck],
  data:{permission:["Payment"]} },
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes,

      {
        useHash: true,
        preloadingStrategy: CustomPreloadingStrategy
      }
    )
  ],
  exports: [RouterModule],
  providers: [CustomPreloadingStrategy]

})
export class AppRoutingModule { }


