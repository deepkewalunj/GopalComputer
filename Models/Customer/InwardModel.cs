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
        public int userId {get;set;}
        public int InwardId { get; set; }
        public List<TypeAheadResponseModel> lstAccessories { get; set; }
        public string OutwardBillStatus { get; set; }
        public string PrintStatus { get; set; }
        public string RepeatJob { get; set; }
        public string SmsStatus { get; set; }
        public string IsProblemDetected { get; set; }
        public string IsRepaired { get; set; }
        public NgbDateModel NgbInwardDate { get; set; }
        public TypeAheadResponseModel CustomerTypeAhead { get; set; }
        public TypeAheadResponseModel ModelNoTypeAhead { get; set; }
        public TypeAheadResponseModel MaterialTypeAhead { get; set; }
        public TypeAheadResponseModel CompanyNameTypeAhead { get; set; }
        public string BarCode { get; set; }
        public string SerialNo { get; set; }
        public string ProblemDescription { get; set; }
        public string EnggName { get; set; }
        public string ReceiverName { get; set; }
        public NgbDateModel NgbDeliveryDate { get; set; }
        public bool IsOwner { get; set; }
        public string MobileNumber { get; set; }
        public bool IsSpecialJob { get; set; }
        public string AdvanceAmount { get; set; }
        public string EstmRepairingAmount { get; set; }
        public string ClientDc { get; set; }
        public string AccBarCode { get; set; }
        public string Accessories { get; set; }

    }


    
}
