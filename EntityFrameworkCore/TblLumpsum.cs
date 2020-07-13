using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblLumpsum
    {
        public int LumpsumId { get; set; }
        public DateTime? LumpsumDate { get; set; }
        public string EnggName { get; set; }
        public int? BillRefId { get; set; }
        public int? OutwardRefId { get; set; }
        public decimal PaidAmount { get; set; }
        public bool PrintStatus { get; set; }
        public int? PaymentMode { get; set; }
        public string PaymentRecievedBy { get; set; }
        public bool SmsSent { get; set; }
        public DateTime? ChequeDate { get; set; }
        public string ChequeNo { get; set; }
        public int? ClientIdRef { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
