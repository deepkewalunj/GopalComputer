import { NgbDate } from '@ng-bootstrap/ng-bootstrap';

export class Lumpsum{
  lumpsumId: number
  lumpsumDate: string
  ngbLumpsumDate: NgbDate
  enggName: string
  billRefId: number
  outwardRefId: number
  paidAmount?: number
  printStatus: string
  paymentMode: string
  paymentRecievedBy: string
  smsSent: string
  chequeDate: string
  ngbChequeDate: NgbDate
  chequeNo: string
  customerName: string
  totalBillAmount: number
  totalOutwordAmount: number
  totalAmountDue: number
  totalPaidAmount: number
  outstandingAmount: number
  clientRefId: number
  customerTypeAhead:any
}
