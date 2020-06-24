import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { DataTablesModule } from 'angular-datatables';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { AppRoutingModule } from './app-routing.module';
import { SampleFormComponent } from './sample-form/sample-form.component';
import { SampleListComponent } from './sample-list/sample-list.component';
import { httpInterceptor } from './interceptor/http-interceptor';
import { ErrorInterceptor } from './interceptor/error-Interceptor';
//import { AuthenticationService } from './services/authentication.service';
import { AuthorizationCheck } from './services/authorization-Check';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    SampleFormComponent,
    SampleListComponent
  ],
  imports: [
    BrowserModule,
  //  DataTablesModule,
    AppRoutingModule,
    RouterModule,
    NgbModule,
    AngularMultiSelectModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule.withConfig({warnOnNgModelWithFormControl: 'never'}),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: httpInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthorizationCheck],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('AppModule loaded');
  }
}
