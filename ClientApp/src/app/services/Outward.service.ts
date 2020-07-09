import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Outward } from '../models/Outward.model';

@Injectable({
  providedIn: 'root'
})
export class OutwardService {


  constructor(private http: HttpClient) { }

  addEditOutward(formData: FormData) {
    return this.http.post<any>(environment.API_URL + 'Outward/AddEditOutward', formData);

  }
  deleteOutward(outwardId: number) {
    return this.http.get<any>(environment.API_URL + 'Outward/DeleteOutward?outwardId=' + outwardId);
  }

  getOutwardById(outwardId: number) {
    return this.http.get<any>(environment.API_URL + 'Outward/GetOutwardById?outwardId=' + outwardId);
  }

  checkOutwardIsGeneratedForJob(outwardId: number, inwardId: number) {
    return this.http.get<any>(environment.API_URL + 'Bill/CheckBillIsGeneratedForJob?billId=' + outwardId + '&inwardId=' + inwardId);
  }
  
}
