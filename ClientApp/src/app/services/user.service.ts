import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<any>(environment.API_URL + 'User/GetUsers');
  }
  GetUserById(userId: number) {
    return this.http.get<any>(environment.API_URL + 'User/GetUserById?userId=' + userId)
      .pipe(map(user => {
        return user;
      }));
  }

  SaveUserData(user: any, modulePermission: any) {
    return this.http.post<any>(environment.API_URL + 'User/SaveUserData', { user, modulePermission })
      .pipe(map(user => {
        return user;
      }));
  }


  deleteUser(userId:number){
    return this.http.get<any>(environment.API_URL+'User/DeleteUser?userId='+userId);
  }
}
