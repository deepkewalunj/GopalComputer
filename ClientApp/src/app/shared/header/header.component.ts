import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { NavCollapseService } from 'src/app/services/nav-collapse.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  public isCollapsed = true;
  public uiBasicCollapsed = false;
  public uiBasicCollapsedr = false;

  constructor(private router: Router, public sharedService: SharedService, private navservice: NavCollapseService, private authenticationService: AuthenticationService) { }

  ngOnInit() {

  }
  

  sidebarToggle(): void {
    this.navservice.sidebarToggle();
    this.navservice.setNavCollapse(false);
  }

  // Logout User
  public DoLogout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
