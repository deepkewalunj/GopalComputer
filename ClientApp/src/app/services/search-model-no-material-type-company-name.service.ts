import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {tblSearchModelNoMaterialTypeCompanyName} from '../models/tblSearchModelNoMaterialTypeCompanyName';
@Injectable({
  providedIn: 'root'
})
export class SearchModelNoMaterialTypeCompanyNameService {

  constructor(private http: HttpClient) { }

  GetSearchModelNoMaterialTypeCompanyNames() {
    return this.http.get<any>(environment.API_URL + 'MaterialType/GetSearchModelNoMaterialTypeCompanyNames');
  }
  GetSearchModelNoMaterialTypeCompanyNameById(searchId: number) {
    return this.http.put<any>(environment.API_URL + 'MaterialType/GetSearchModelNoMaterialTypeCompanyNameById', { searchId })
      .pipe(map(materialTypeDetail => {
        return materialTypeDetail;
      }));
  }

  SaveSearchModelNoMaterialTypeCompanyNameData(tblSearchModelNoMaterialTypeCompanyNameInputModel: tblSearchModelNoMaterialTypeCompanyName) {
    return this.http.post<any>(environment.API_URL + 'MaterialType/SaveSearchModelNoMaterialTypeCompanyNameData', tblSearchModelNoMaterialTypeCompanyNameInputModel )
      .pipe(map(materialTypeDetail => {
        return materialTypeDetail;
      }));
  }


  DeleteSearchModelNoMaterialTypeCompanyName(searchId:number){
    return this.http.get<any>(environment.API_URL+'MaterialType/DeleteSearchModelNoMaterialTypeCompanyName?searchId='+searchId);
  }
}
