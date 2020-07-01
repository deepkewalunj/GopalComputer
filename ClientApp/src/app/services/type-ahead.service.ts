import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TypeAheadRequestModel } from '../models/typeahead.model';

@Injectable({
  providedIn: 'root'
})
export class TypeAheadService {


  constructor(private http: HttpClient) { }


  GetTypeAheadList(searchType:number,searchText:string,listType:number) {

    return this.http.post<any>(environment.API_URL+'TypeAheadCommon/GetTypeAheadList',
    {searchType:searchType,searchText:searchText,listType:listType});

  }
}
