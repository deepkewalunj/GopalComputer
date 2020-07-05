using System;
using System.Collections.Generic;

namespace Gopal.EntityFrameworkCore
{
    public partial class TblBillAndInwardDetail
    {
        public int BillAndInwardId { get; set; }
        public int? BillIdRef { get; set; }
        public int? InwardIdRef { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}
