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
    return this.http.get<any>(environment.API_URL + 'User/GetUsers')
      .pipe(map(users => {
        return users;
      }));
  }
  GetUserById(userId: number) {
    return this.http.put<any>(environment.API_URL + 'User/GetUserById', { userId })
      .pipe(map(user => {
        return user;
      }));
  }
}
