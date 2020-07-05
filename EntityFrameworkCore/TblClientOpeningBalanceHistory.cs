using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblClientOpeningBalanceHistory
    {
        public int ClientOpeningBalanceHistoryId { get; set; }
        public int BillIdRef { get; set; }
        public int OutwardIdRef { get; set; }
        public double OldBalance { get; set; }
        public double DebitedAmount { get; set; }
        public double CreditedAmount { get; set; }
        public double NewBalance { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
