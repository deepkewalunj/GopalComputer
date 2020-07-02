import { TypeAheadSelect } from './common.model';

import { TypeAheadResponseModel, TypeAheadRequestModel } from 'src/app/models/typeahead.model';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
export class Inward {


  lstAccessories: TypeAheadResponseModel[];
  ngbInwardDate: NgbDate;
  customerTypeAhead: TypeAheadResponseModel;
  modelNoTypeAhead: TypeAheadResponseModel;
  materialTypeAhead: TypeAheadResponseModel;
  companyNameTypeAhead: TypeAheadResponseModel;
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
}

export class InwardListModel{
  inwardId:string
   clientName:string
   enggName:string
   inwardDate:string
   deliveryDate:string
   outwardBillStatus: string
}
