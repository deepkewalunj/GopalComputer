import { TypeAheadResponseModel } from './typeahead.model'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class ReportSearchModel{
  customerName:any
  reportId :string
  reportFromDate: NgbDate
  reportToDate :NgbDate
}

export class ReportModel{
  reportId :number
  jobNumbers :string
  reportDate :string
  clientName:string
  materialName:string
  serviceAmount:number
  advanceAmount :number
  paidImmediatlyAmount :number
  outstandingAmount:number
  outwardBillStatus:string
  repairedStatus:string
  billOutwardAmount:number
  paymentAmount:number
  mobileNumber:string
}


export class ClientOutstandingSMSModel{
    mobileNumber :string
    clientId :number
    outstandingAmount :string
}
