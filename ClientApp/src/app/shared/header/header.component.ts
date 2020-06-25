import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  firstName: string;
  lastName: string;
  constructor(private router: Router, private sharedService: SharedService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.firstName = this.sharedService.firstName;
    this.lastName = this.sharedService.lastName;
  }

  // Logout User
  public DoLogout() {
    this.firstName = "";
    this.lastName = "";
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
