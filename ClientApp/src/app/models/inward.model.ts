import { TypeAheadSelect } from './common.model';

export class Inward {
  InwardId: number;
  InwardDate?: string
  ClientRefId?: number
  ModelNo: string
  MaterialType: string
  CompanyName: string
  CustomerTypeAhead:TypeAheadSelect;
  ModelNoTypeAhead:TypeAheadSelect;
  MaterialTypeAhead:TypeAheadSelect;
  CompanyNameTypeAhead:TypeAheadSelect;
  BarCode: string
  SerialNo: string
  ProblemDescription: string
  EnggName: string
  IsOwner: boolean
  MobileNumber: string
  SmsStatus: boolean
  ReceiverName: string
  IsProblemDetected: boolean
  IsSpecialJob: boolean
  DeliveryDate?: string
  AdvanceAmount?: number
  OutwardBillStatus?: number
  EstmRepairingAmount?: number
  IsRepaired: boolean
  PrintStatus: boolean
  RepeatJob: boolean
  RepeatJobDesc: string
  ClientDc: string
  AccBarCode: string
  Accessories: string
}
