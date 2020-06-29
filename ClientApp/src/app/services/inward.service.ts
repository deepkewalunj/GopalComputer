import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Inward } from '../models/inward.model';

@Injectable({
  providedIn: 'root'
})
export class InwardService {


  constructor(private http: HttpClient) { }

  addEditCustomer(inwardModel:Inward) {
    return this.http.post<any>(environment.API_URL+'Inward/AddEditInward',inwardModel);

  }
  deleteCustomer(inwardId:number){
    return this.http.get<any>(environment.API_URL+'Inward/DeleteInward?inwardId='+inwardId);
  }
}
