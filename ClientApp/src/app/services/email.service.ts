import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {


  constructor(private http: HttpClient) { }


  SendEmailToCA(formData:any){
    return this.http.post<any>(environment.API_URL + 'Email/SendEmailToCA', formData);
  }

  SendAccountStatementEmail(id, fd, fm, fy, td, tm, ty){
    return this.http.get<any>(environment.API_URL + 'Email/SendAccountStatementEmail?id=' + id + '&fd=' + fd + '&fm=' + fm + '&fy=' + fy + '&td=' + td + '&tm=' + tm + '&ty=' + ty);
  }

}
