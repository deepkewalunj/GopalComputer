import { Component, OnInit } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { CustomerService } from './services/customer.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { QzTrayService } from './services/qz-tray.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  title = 'Gopal Computers';

  constructor(private router: Router, public sharedService: SharedService,
     private authenticationService: AuthenticationService,
     private printService: QzTrayService) {

     }

     ngOnInit(){
      this.printService.initQZ();
     }



}
