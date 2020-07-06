import { TypeAheadResponseModel } from './typeahead.model'
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class Bill{
  billId: number
  billDate: string
  ngbBillDate: NgbDate
  enggName: string
  testedOk: string
  materialUsed: string
  serviceAmount: number
  advanceAmount?: number
  paidImmediatlyAmount: number
  outstandingAmount: number
  printStatus: string
  materialAdded: string
  paymentMode: string
  smsSent: string
  paymentRecievedBy: string
  lstJobNumbers: TypeAheadResponseModel[]
  chequeDate: string
  ngbChequeDate: NgbDate
  chequeNo: string
}