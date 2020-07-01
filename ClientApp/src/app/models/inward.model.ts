import { TypeAheadSelect } from './common.model';

import { TypeAheadResponseModel, TypeAheadRequestModel } from 'src/app/models/typeahead.model';
export class Inward {
  InwardId: number;
  InwardDate: string
  NgbInwardDate:any
  ClientRefId?: number
  ModelNo: string
  MaterialType: string
  CompanyName: string
  CustomerTypeAhead:TypeAheadResponseModel;
  ModelNoTypeAhead:TypeAheadResponseModel;
  MaterialTypeAhead:TypeAheadResponseModel;
  CompanyNameTypeAhead:TypeAheadResponseModel;
  BarCode: string
  SerialNo: string
  ProblemDescription: string
  EnggName: string
  IsOwner: boolean
  MobileNumber: string
  SmsStatus: string
  ReceiverName: string
  IsProblemDetected: string;
  IsSpecialJob: boolean
  DeliveryDate: string
  NgbDeliveryDate : any;
  AdvanceAmount?: number
  OutwardBillStatus: string;
  EstmRepairingAmount?: number
  IsRepaired: string
  PrintStatus: string;
  RepeatJob: string;
  RepeatJobDesc: string
  ClientDc: string
  AccBarCode: string
  Accessories: string
  lstAccessories:TypeAheadResponseModel[]
}
