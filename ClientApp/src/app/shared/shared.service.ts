import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() {
    
  }

  getFullName() {
    const helper = new JwtHelperService();
    if (localStorage.getItem('TokenInfo')) {
      var decoded = helper.decodeToken(localStorage.getItem('TokenInfo'));
      return decoded.firstName + decoded.lastName;
    }
  }

  isLoggedIn() {
    if (localStorage.getItem('TokenInfo')) {
      return true;
    }
    else
    {
      return false;
    }
  }
  
  getRoleId() {
    const helper = new JwtHelperService();
    if (localStorage.getItem('TokenInfo')) {
      var decoded = helper.decodeToken(localStorage.getItem('TokenInfo'));
      return parseInt(decoded.userRole);
    }
  }
  
}
