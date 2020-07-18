import { TypeAheadSelect, FilePoco } from './common.model';

import { TypeAheadResponseModel, TypeAheadRequestModel } from 'src/app/models/typeahead.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
export class Inward {

  clientName: string;
  lstAccessories: TypeAheadResponseModel[];
  ngbInwardDate: NgbDate;
  customerTypeAhead: TypeAheadResponseModel;
  modelNoTypeAhead: any;
  materialTypeAhead: any;
  companyNameTypeAhead: any;
  ngbDeliveryDate: NgbDate;
  userId: number;
  inwardId: number;
  inwardDate: string;
  clientRefId: number;
  modelNo: string;
  materialType: string;
  companyName: string;
  outwardBillStatus: string;
  printStatus: string;
  repeatJob: string;
  repeatJobDesc?: any;
  smsStatus: string;
  isProblemDetected: string;
  isRepaired: string;
  barCode: string;
  serialNo: string;
  problemDescription: string;
  enggName: string;
  receiverName: string;
  isOwner: boolean;
  mobileNumber: string;
  isSpecialJob: boolean;
  deliveryDate: Date;
  advanceAmount: string;
  estmRepairingAmount: string;
  clientDc: string;
  accBarCode: string;
  accessories: string;
  inwardFiles:FilePoco[];
  repairedRemark:string;
  inwardBarCodeZPL:string[];
  barCodePrinterName:string;
  normalPrinterName:string;
  isOutwardOrBillExist:boolean;
  bankAccountNoPrint: string;
  bankNamePrint: string;
  ifscCodePrint: string;
  gPayPrint: string;
  inwardAddressPrint: string;
  inwardAddressPhoneNoPrint: string;

}

export class InwardListModel{
  inwardId:string
   clientName:string
   modelNo:string
   isRepaired:number
   deliveryDate:string
   outwardBillStatus: string
}
