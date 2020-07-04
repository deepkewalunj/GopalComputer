import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Inward } from '../models/inward.model';
import { TypeAheadRequestModel } from '../models/typeahead.model';

@Injectable({
  providedIn: 'root'
})
export class InwardService {


  constructor(private http: HttpClient) { }

  addEditInward(formData:FormData) {

    return this.http.post<any>(environment.API_URL+'Inward/AddEditInward',formData);

  }
  getInward(inwardId) {
    return this.http.get<any>(environment.API_URL+'Inward/GetInwardById?inwardId='+inwardId);

  }
  deleteInward(inwardId:number){
    return this.http.get<any>(environment.API_URL+'Inward/DeleteInWard?inwardId='+inwardId);
  }

  GetInwardBarcode(inwardId:number){
    return this.http.get<any>(environment.API_URL+'Inward/GetInwardBarcode?inwardId='+inwardId);
  }

}
