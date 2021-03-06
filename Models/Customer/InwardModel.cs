﻿using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Customer
{


    public static class NgbDateModelToDatetime {
        public static DateTime? ToDateTime(this NgbDateModel ngbDateModel) {
            if (ngbDateModel == null)
            {
                return (DateTime?)null;
            }
            return new DateTime(ngbDateModel.year, ngbDateModel.month, ngbDateModel.day);
        }
        public static NgbDateModel ToNgbDateModel(this DateTime? datetime)
        {
            if (datetime == null)
            {
                return null;
            }
            return new NgbDateModel {year= datetime.Value.Year, month=datetime.Value.Month,day= datetime.Value.Day };
        }
    }


    public class NgbDateModel
    {
        public int year { get; set; }
        public int month { get; set; }
        public int day { get; set; }

    }
    public class InwardModel
    {
        public int userId { get; set; }
        public int inwardId { get; set; }
        public DateTime? inwardDate { get; set; }
        public int clientRefId { get; set; }
        public string modelNo { get; set; }
        public string materialType { get; set; }
        public string companyName { get; set; }
        public string outwardBillStatus { get; set; }
        public string printStatus { get; set; }
        public string repeatJob { get; set; }
        public string repeatJobDesc { get; set; }
        public string smsStatus { get; set; }
        public string isProblemDetected { get; set; }
        public string isRepaired { get; set; }
        public string repairedRemark { get; set; }
        public string barCode { get; set; }
        public string serialNo { get; set; }
        public string problemDescription { get; set; }
        public string enggName { get; set; }
        public string receiverName { get; set; }
        public bool isOwner { get; set; }
        public string mobileNumber { get; set; }
        public bool isSpecialJob { get; set; }
        public DateTime? deliveryDate { get; set; }
        public double advanceAmount { get; set; }
        public double estmRepairingAmount { get; set; }
        public string clientDc { get; set; }
        public string accBarCode { get; set; }
        public string accessories { get; set; }
    }
    public class InwardTypeScriptModel:InwardModel
    {
       
        public List<TypeAheadResponseModel> lstAccessories { get; set; }
       
        public NgbDateModel ngbInwardDate { get; set; }
        public TypeAheadResponseModel customerTypeAhead { get; set; }
        public Object modelNoTypeAhead { get; set; }
        public Object materialTypeAhead { get; set; }
        public Object companyNameTypeAhead { get; set; }
        public NgbDateModel ngbDeliveryDate { get; set; }
        public List<FilePOCO> inwardFiles { get; set; }
        public string clientName { get; set; }
        public List<string> inwardBarCodeZPL { get; set; }
        public bool isOutwardOrBillExist { get; set; }
        public string barCodePrinterName { get; set; }
        public string normalPrinterName { get; set; }
        public string bankAccountNoPrint { get; set; }
        public string bankNamePrint { get; set; }
        public string ifscCodePrint { get; set; }
        public string gPayPrint { get; set; }
        public string inwardAddressPrint { get; set; }
        public string inwardAddressPhoneNoPrint { get; set; }


    }
    public class FilePOCO {

            public int documentId { get; set; }
            public string originalFilename { get; set; }
            public object file { get; set; }
            public string uniqueFilename { get; set; }

        
    }

    public class InwardListModel
    {
        public int inwardId { get; set; }
        public string clientName { get; set; }
        public string modelNo { get; set; }
        public int isRepaired { get; set; }
        public DateTime? deliveryDate { get; set; }
        public DateTime? inwardDate { get; set; }
        public string outwardBillStatus { get; set; }
        public string companyName { get; set; }

    }
    public class InwardBarCodeModel {
        public string customerName { get; set; }
        public string accessory { get; set; }
        public string enggName { get; set; }
        public int inwardId { get; set; }
    }
}
