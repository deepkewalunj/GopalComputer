import { Injectable } from '@angular/core';
import { jwt_decode } from 'jwt-decode';
import { decode } from 'punycode';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  firstName: string;
  lastName: string;
  userId: string;
  userRole: string;
  constructor() {
    this.firstName;
    this.lastName;
    this.userId;
    this.userRole;
  }

  setUserInfo() {
    if (localStorage.getItem('TokenInfo')) {
      var decoded = jwt_decode(localStorage.getItem('TokenInfo'));
      console.log(decoded);
      this.firstName = decoded.firstName;
      this.lastName = decoded.lastName;
      this.userRole = decoded.userRole;
      this.userId = decoded.userId;
      return true;
    }
  }
  removeUserInfo() {
    this.firstName = "";
    this.lastName = "";
    this.userRole = "";
    this.userId = "";
  }
}
