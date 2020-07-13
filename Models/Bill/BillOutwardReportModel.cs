using Gopal.Models.Common;
using Gopal.Models.Customer;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Gopal.Models.Bill
{
    public class BillOutwardReportModel
    {

        public int reportId { get; set; }
        public string jobNumbers { get; set; }
        public DateTime? reportDate { get; set; }
        public float serviceAmount { get; set; }
        public float advanceAmount { get; set; }
        public float paidImmediatlyAmount { get; set; }
        public float outstandingAmount { get; set; }
    }

    public class BillOutwardReportSearchModel {
        public object customerName { get; set; }
        public string reportId { get; set; }
        public NgbDateModel reportFromDate { get; set; }
        public NgbDateModel reportToDate { get; set; }
    }
}
