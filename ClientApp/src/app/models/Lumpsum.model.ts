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
  customerTypeAhead: any
  normalPrinterName: string
  gstNo: string
  customerAddress: string
  bankAccountNoPrint: string;
  bankNamePrint: string;
  ifscCodePrint: string;
  gPayPrint: string;
  inwardAddressPrint: string;
  inwardAddressPhoneNoPrint: string;
}


export class GetPaymentDetailsBySearchModel {
   startDate :NgbDate;
   endDate:NgbDate;
}

export class PaymentByMethod {
  id :number;
    jobNumber :string;
    billDate :string;
    companyName :string;
    billReportStatus :string;
    engineerName :string;
    paidImmediately :number
}
export class PaymentByListModel {
    methodType:string;
    lstPaymentbymethod :PaymentByMethod[];
   paymentByMethodTotal :number;
}
export class PaymentListModel {
   normalPrinterName :string;
   inwardAddressPrint:string;
   inwardAddressPhoneNoPrint :string;
  paymentListModel :PaymentByListModel[];
  paymentListTotal :number
}
