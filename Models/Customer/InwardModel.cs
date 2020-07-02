using Gopal.Models.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Customer
{


   
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
        public string barCode { get; set; }
        public string serialNo { get; set; }
        public string problemDescription { get; set; }
        public string enggName { get; set; }
        public string receiverName { get; set; }
        public bool isOwner { get; set; }
        public string mobileNumber { get; set; }
        public bool isSpecialJob { get; set; }
        public DateTime? deliveryDate { get; set; }
        public string advanceAmount { get; set; }
        public string estmRepairingAmount { get; set; }
        public string clientDc { get; set; }
        public string accBarCode { get; set; }
        public string accessories { get; set; }
    }
    public class InwardTypeScriptModel:InwardModel
    {
       
        public List<TypeAheadResponseModel> lstAccessories { get; set; }
       
        public NgbDateModel ngbInwardDate { get; set; }
        public TypeAheadResponseModel customerTypeAhead { get; set; }
        public TypeAheadResponseModel modelNoTypeAhead { get; set; }
        public TypeAheadResponseModel materialTypeAhead { get; set; }
        public TypeAheadResponseModel companyNameTypeAhead { get; set; }
        public NgbDateModel ngbDeliveryDate { get; set; }
       

    }

    public class InwardListModel
    {
        public int inwardId { get; set; }
        public string clientName { get; set; }
        public string enggName { get; set; }
        public DateTime? inwardDate { get; set; }
        public DateTime? deliveryDate { get; set; }
        public int outwardBillStatus { get; set; }

    }
    
}
