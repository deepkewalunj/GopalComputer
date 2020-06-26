import { Component } from '@angular/core';
import { SharedService } from './shared/shared.service';
import { AuthenticationService } from './services/authentication.service';
import { Router } from '@angular/router';
import { CustomerService } from './services/customer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'sample';

  constructor(private router: Router, public sharedService: SharedService,
     private authenticationService: AuthenticationService) { }

}
