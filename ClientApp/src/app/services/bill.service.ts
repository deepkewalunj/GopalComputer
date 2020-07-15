import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BillService {


  constructor(private http: HttpClient) { }

  addEditBill(formData: FormData) {
    return this.http.post<any>(environment.API_URL + 'Bill/AddEditBill', formData);

  }
  deleteBill(billId: number) {
    return this.http.get<any>(environment.API_URL + 'Bill/DeleteBill?billId=' + billId);
  }

  getBillById(billId: number) {
    return this.http.get<any>(environment.API_URL + 'Bill/GetBillById?billId=' + billId);
  }

  checkBillIsGeneratedForJob(billId: number, inwardId: number) {
    return this.http.get<any>(environment.API_URL + 'Bill/CheckBillIsGeneratedForJob?billId=' + billId + '&inwardId=' + inwardId);
  }

}
