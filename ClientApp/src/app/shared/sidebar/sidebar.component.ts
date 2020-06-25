

import { Component, OnInit, Input } from '@angular/core';
import { NavCollapseService } from 'src/app/services/nav-collapse.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { from } from 'rxjs';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  isShown = false;
  public uiBasicCollapsed = false;
  public uiBasicCollapsedr = false;
  public uiBasicCollapsedIn = false;


  constructor(private navservice: NavCollapseService, public sharedService: SharedService, private breakpointObserver: BreakpointObserver) {
  }


 ngOnInit(): void {
  this.navservice.getNavCollapse().subscribe(x => {
    this.uiBasicCollapsed = x;
  });

//media breakpoints
   
 }

 deviceSidemenuCollapse(): void {
  // this.breakpointObserver.observe([
  //     Breakpoints.XSmall,
  //     Breakpoints.Small,
  //     Breakpoints.Medium,
  //     Breakpoints.Large,
  //     Breakpoints.XLarge
  //   ]).subscribe(result => {
  //     if (result.breakpoints[Breakpoints.Large]) {
  //   this.navservice.sidebarToggle();
  //  this.navservice.setNavCollapse(false);
  //     }
    
  //   });

  if (this.breakpointObserver.isMatched('(max-width:769px)')) {
    this.navservice.sidebarToggle();
   this.navservice.setNavCollapse(false);
  }
    
 }

 sidebarToggle(): void {
   this.navservice.sidebarToggle();
   this.navservice.setNavCollapse(false);
 }


}










