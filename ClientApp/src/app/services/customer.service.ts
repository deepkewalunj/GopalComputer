import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Customer } from '../models/Customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {


  constructor(private http: HttpClient) { }

  addEditCustomer(customerModel:Customer) {
    return this.http.post<any>(environment.API_URL+'Customer/AddEditCustomer',customerModel);

  }
}
