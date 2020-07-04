import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TypeAheadRequestModel } from '../models/typeahead.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TypeAheadService {


  constructor(private http: HttpClient) { }

getSearchType(searchType){
  if(typeof searchType=="object")
  {
    return searchType.searchValue;
  }
  else {

    return searchType;
  }

}

  GetTypeAheadList(searchType:any,searchText:string,listType:number) {
if(searchType){
  return this.http.post<any>(environment.API_URL+'TypeAheadCommon/GetTypeAheadList',
    {searchType:this.getSearchType(searchType),searchText:searchText,listType:listType});
}
return of([]);


  }
}
