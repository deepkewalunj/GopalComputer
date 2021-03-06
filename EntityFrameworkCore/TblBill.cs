﻿using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblBill
    {
        public int BillId { get; set; }
        public DateTime? BillDate { get; set; }
        public string EnggName { get; set; }
        public bool TestedOk { get; set; }
        public bool MaterialUsed { get; set; }
        public decimal ServiceAmount { get; set; }
        public decimal AdvanceAmount { get; set; }
        public decimal PaidImmediatlyAmount { get; set; }
        public decimal OutstandingAmount { get; set; }
        public bool PrintStatus { get; set; }
        public bool MaterialAdded { get; set; }
        public int? PaymentMode { get; set; }
        public string PaymentRecievedBy { get; set; }
        public bool SmsSent { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? ChequeDate { get; set; }
        public string ChequeNo { get; set; }
        public bool IsOpeningBalanceEntry { get; set; }
        public int? ClientIdRef { get; set; }
    }
}
