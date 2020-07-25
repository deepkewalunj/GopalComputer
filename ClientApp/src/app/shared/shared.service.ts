import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { UserModule } from '../models/user-permission';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() {

  }


  get AUTH_TOKEN(){
    const helper = new JwtHelperService();
    return helper.decodeToken(localStorage.getItem('TokenInfo'));
  }

  isLoggedIn(): boolean {
    if (localStorage.getItem('TokenInfo')) {
      return true;
    }
    else
    {
      return false;
    }
  }

  getFullName() {
  if (this.isLoggedIn()) {
      return this.AUTH_TOKEN.firstName + ' ' + this.AUTH_TOKEN.lastName;
    }
  }

  smsCount() {
    if (this.isLoggedIn()) {
      return this.AUTH_TOKEN.smsCount;
    }
  }

  getRoleId() {
   if (this.isLoggedIn()) {
      return parseInt(this.AUTH_TOKEN.userRole);
    }
  }

  getPermissions():UserModule[]{
    return JSON.parse(this.AUTH_TOKEN.modules);
  }

  isMenuShow(moduleName): boolean {
    var permissions = this.getPermissions();
    let validModule = permissions.find(x => x.ModuleName == moduleName);
    if (validModule) {
      return false;
    }
    else {
      return true;
    }
  }
}
