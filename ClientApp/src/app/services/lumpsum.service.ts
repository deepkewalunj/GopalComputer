import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LumpsumService {

  constructor(private http: HttpClient) { }

  
  getStatementAmount(clientRefId: number) {
    return this.http.get<any>(environment.API_URL + 'Payment/getStatementAmount?clientRefId=' + clientRefId);
  }

  addEditLumpsum(formData: FormData) {
    return this.http.post<any>(environment.API_URL + 'Payment/AddEditLumpsum', formData);

  }
  deleteLumpsum(lumpsumId: number) {
    return this.http.get<any>(environment.API_URL + 'Payment/DeleteLumpsum?lumpsumId=' + lumpsumId);
  }

  getLumpsumById(lumpsumId: number) {
    return this.http.get<any>(environment.API_URL + 'Payment/GetLumpsumById?lumpsumId=' + lumpsumId);
  }

  addEditBillByBill(formData: FormData) {
    return this.http.post<any>(environment.API_URL + 'Payment/AddEditBillByBill', formData);

  }
  deleteBillByBill(lumpsumId: number) {
    return this.http.get<any>(environment.API_URL + 'Payment/DeleteBillByBill?lumpsumId=' + lumpsumId);
  }

  getBillByBillById(lumpsumId: number) {
    return this.http.get<any>(environment.API_URL + 'Payment/GetBillByBillById?lumpsumId=' + lumpsumId);
  }

  addEditOutwardByOutward(formData: FormData) {
    return this.http.post<any>(environment.API_URL + 'Payment/AddEditOutwardByOutward', formData);

  }
  deleteOutwardByOutward(lumpsumId: number) {
    return this.http.get<any>(environment.API_URL + 'Payment/DeleteOutwardByOutward?lumpsumId=' + lumpsumId);
  }

  getOutwardByOutwardById(lumpsumId: number) {
    return this.http.get<any>(environment.API_URL + 'Payment/GetOutwardByOutwardById?lumpsumId=' + lumpsumId);
  }

}
