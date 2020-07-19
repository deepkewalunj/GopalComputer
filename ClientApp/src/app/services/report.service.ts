import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Bill, BillOutwardReportSearchModel } from '../models/Bill.model';
import { ReportSearchModel } from '../models/Report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {


  constructor(private http: HttpClient) { }


  GetBillReportList(searchModel:ReportSearchModel){
    return this.http.post<any>(environment.API_URL + 'Report/GetBillReportList', searchModel);
  }

  GetOutwardReportList(searchModel:ReportSearchModel){
    return this.http.post<any>(environment.API_URL + 'Report/GetOutwardReportList', searchModel);
  }
  GetInwardReportList(searchModel:ReportSearchModel){
    return this.http.post<any>(environment.API_URL + 'Report/GetInwardReportList', searchModel);
  }
  GetClientOutstandingReportList(){
    return this.http.get<any>(environment.API_URL + 'Report/GetClientOutstandingReportList');
  }
  GetAccountStatementReport(searchModel: ReportSearchModel) {
    return this.http.post<any>(environment.API_URL + 'Report/GetAccountStatementReport', searchModel);
  }
}
