using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblInward
    {
        public int InwardId { get; set; }
        public DateTime? InwardDate { get; set; }
        public int? ClientRefId { get; set; }
        public string ModelNo { get; set; }
        public string MaterialType { get; set; }
        public string CompanyName { get; set; }
        public string BarCode { get; set; }
        public string SerialNo { get; set; }
        public string ProblemDescription { get; set; }
        public string EnggName { get; set; }
        public bool IsOwner { get; set; }
        public string MobileNumber { get; set; }
        public bool SmsStatus { get; set; }
        public string ReceiverName { get; set; }
        public bool IsProblemDetected { get; set; }
        public bool IsSpecialJob { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public double? AdvanceAmount { get; set; }
        public int? OutwardBillStatus { get; set; }
        public double? EstmRepairingAmount { get; set; }
        public bool IsRepaired { get; set; }
        public bool PrintStatus { get; set; }
        public bool RepeatJob { get; set; }
        public string RepeatJobDesc { get; set; }
        public string ClientDc { get; set; }
        public string AccBarCode { get; set; }
        public string Accessories { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
