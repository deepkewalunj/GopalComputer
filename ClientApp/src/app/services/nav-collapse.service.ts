import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavCollapseService {

 public uiBasicCollapsed = new BehaviorSubject<boolean>(false);
  darkMode = false;

  private sidebarVisible: boolean;

  constructor() { }

  sidebarToggle() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      // this.renderer.addClass(this.document.html, 'dark-mode');
      const html = document.getElementsByTagName('html')[0];
      html.classList.add('nav-open');
    } else {
      // this.renderer.removeClass(this.document.body, 'dark-mode');
      const html = document.getElementsByTagName('html')[0];
      html.classList.remove('nav-open');
    }

  }




  setNavCollapse(uiBasicCollapsed: boolean) {
    this.uiBasicCollapsed.next(uiBasicCollapsed);
  }

  getNavCollapse() {
    return this.uiBasicCollapsed.asObservable();
  }


  // sidebarToggle(){
  //   if (this.sidebarVisible === false) {
  //     this.sidebarOpen();
  //   } else {
  //       this.sidebarClose();
  //   }

  // }

  // sidebarOpen() {
  //   const sidebar =  <HTMLElement>document.getElementsByClassName('sidebar')[0];
  //   sidebar.classList.add('nav-open');
  //   const html = document.getElementsByTagName('html')[0];
  //   html.classList.add('nav-open');
  //   this.sidebarVisible = true;
  // }

  // sidebarClose() {
  //   const sidebar =  <HTMLElement>document.getElementsByClassName('sidebar')[0];
  //   sidebar.classList.remove('nav-open');
  //   const html = document.getElementsByTagName('html')[0];
  //   html.classList.remove('nav-open');
  //   this.sidebarVisible = false;
  // }
}
