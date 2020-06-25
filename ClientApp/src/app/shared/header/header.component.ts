import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  
  constructor(private router: Router, private sharedService: SharedService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    
  }


  // Logout User
  public DoLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
