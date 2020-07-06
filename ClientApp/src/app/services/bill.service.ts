import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bill } from '../models/Bill.model';

@Injectable({
  providedIn: 'root'
})
export class BillService {


  constructor(private http: HttpClient) { }

  addEditBill(billModel: Bill) {
    return this.http.post<any>(environment.API_URL + 'Bill/AddEditBill', billModel);

  }
  deleteBill(billId: number) {
    return this.http.get<any>(environment.API_URL + 'Bill/DeleteBill?billId=' + billId);
  }
}
