import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AccessoryInputModel } from '../models/AccessoryInputModel';

@Injectable({
  providedIn: 'root'
})
export class MaterialAccessoryService {
  constructor(private http : HttpClient) { }
  getAccessories(){
    return this.http.get<any>(environment.API_URL + '/Accessory/getAccessories');
  }
  getAccessoryById(accessoryId : number){
    return this.http.get<any>(environment.API_URL + '/Accessory/getAccessoryById?accessoryId=' + accessoryId);
  }
  saveAccessory(accessoryInputModel : AccessoryInputModel){
    return this.http.post<any>(environment.API_URL + '/Accessory/saveAccessory', accessoryInputModel)
  }
  deleteAccessory(accessoryId : number){
    return this.http.delete<any>(environment.API_URL + '/Accessory/deleteAccessory?accessoryId=' + accessoryId);
  }
}
